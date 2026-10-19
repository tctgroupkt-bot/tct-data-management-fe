import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductLabel from "../../ProductLabel.tsx";
import Input from "../../input/product/ProductInputField.tsx";
import ProductTextArea from "../../input/product/ProductTextArea.tsx";
import { useStore } from "../../../../../app/stores/store.ts";
import CompanyCodeGroup from "../../company-code/CompanyCode.tsx";
import { observer } from "mobx-react-lite";
import ProcessingGroup from "../../processing/Processing.tsx";
import StorageGroup from "../../storage/Storage.tsx";
import CalculatedUnit from "../../calculated-unit/CalculatedUnit.tsx";
import { ProductDetail } from "../../../../../app/models/product/product.model.ts";
import { appCurrency } from "../../../../../app/common/common.ts";
import { NumericFormat } from "react-number-format";
import { useState, useEffect, useCallback } from "react";
import FactoryGroup from "../../product-factory/Factory.tsx";
import { useNetworkStatus } from "../../../../../hooks/useNetworkStatus";
import { debounce } from "lodash";
import ProcessingPriceModal from "./ProcessingPriceModal";
import { toast } from "react-toastify";

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: unknown) => void;
  onValidationChange?: (
    field: string,
    isValid: string,
    errorMessage?: string
  ) => void;
}

const barcode = "AK";

const ProductDefaultInputs = ({
  product,
  isCreateMode,
  onChange,
  onValidationChange,
}: ProductProps) => {
  const isOnline = useNetworkStatus();
  const {
    productStore,
    companyCodeStore,
    sizeStore,
    supplierStore,
    patternStore,
    colorStore,
    bodyColorStore,
    materialStore,
    surfaceStore,
    originStore,
    factoryStore,
  } = useStore();

  const { productSizeList } = sizeStore;
  const { productSupplierList } = supplierStore;
  const { productCompanyCodeList } = companyCodeStore;
  const { productPatternList } = patternStore;
  const { productColorList } = colorStore;
  const { productBodyColorList } = bodyColorStore;
  const { productMaterialList } = materialStore;
  const { productSurfaceList } = surfaceStore;
  const { productOriginList } = originStore;
  const { getNextOrderNumberAuto } = productStore;
  const { productFactoryList } = factoryStore;

  // Helper function để lấy tên ngắn bề mặt
  const getSurfaceShortName = (surfaceFeature: any): string => {
    if (!surfaceFeature) return "";
    
    const surfaceName = surfaceFeature.name;
    const surfaceShortCode = surfaceFeature.shortCode;
    
    // Các trường hợp đặc biệt - mapping từ shortCode sang tên ngắn
    const specialCases: { [key: string]: string } = {
      "M": "MỜ",
      "G": "BÓNG", 
      "L": "BÁN BÓNG",
      "P": "SẦN",
      "MT": "MỜ MỊN",
      "GH": "SIÊU BÓNG",
      "MP": "MỜ NHÁM",
      "MC": "MỜ CARVING",
      "MS": "MỜ SUGAR",
      "MSC": "MỜ HẠT ĐƯỜNG CARVING",
      "K": "KEO"
    };

    // Kiểm tra xem có phải trường hợp đặc biệt không
    if (surfaceShortCode && specialCases[surfaceShortCode]) {
      return specialCases[surfaceShortCode];
    } else {
      // Nếu không phải trường hợp đặc biệt, lấy từ đầu tiên của tên
      if (surfaceName) {
        const firstWord = surfaceName.split(' ')[0];
        return firstWord;
      }
      return "";
    }
  };

  const [supplierItemCode, setSupplierItemCode] = useState<string>("");
  const [isValidSupplierCode, setIsValidSupplierCode] = useState<
    boolean | null
  >(null);
  const [websiteProductName, setWebsiteProductName] = useState<string>("");
  const [sapo, setSapo] = useState<string>("");
  const [otherNote, setOtherNote] = useState<string>(product?.otherNote || "");
  const [deliveryEstimatedDate, setDeliveryEstimatedDate] = useState<string>(
    product?.deliveryEstimatedDate || "1-2 ngày"
  );
  const [manualOrderNumber, setManualOrderNumber] = useState<string>(
    productStore.productForm.productOrderNumber?.toString() || ""
  );
  const [isChecking, setIsChecking] = useState(false);
  const [isProcessingPriceModalOpen, setIsProcessingPriceModalOpen] =
    useState(false);

  // Thêm state để theo dõi việc người dùng đã chỉnh sửa sapoName thủ công
  const [isSapoNameManuallyEdited, setIsSapoNameManuallyEdited] = useState(false);
  // Thêm state để theo dõi việc người dùng đã chỉnh sửa displayWebsiteName thủ công
  const [isDisplayWebsiteNameManuallyEdited, setIsDisplayWebsiteNameManuallyEdited] = useState(false);

  // Add effect to update manualOrderNumber when productOrderNumber changes from store
  useEffect(() => {
    productStore.updateProductForm("deliveryEstimatedDate", "1-2 ngày");
  }, []);

  // Reset flag khi product thay đổi (load sản phẩm mới)
  useEffect(() => {
    if (!isCreateMode && product) {
      setIsSapoNameManuallyEdited(false);
      setIsDisplayWebsiteNameManuallyEdited(false);
    }
  }, [isCreateMode, product?.id]);

  useEffect(() => {
    if (isOnline && productStore.productForm.productOrderNumber) {
      setManualOrderNumber(
        productStore.productForm.productOrderNumber.toString()
      );
    }
  }, [productStore.productForm.productOrderNumber, isOnline]);

  // Add effect to update product code when supplier changes
  useEffect(() => {
    if (productStore.productForm.supplierId) {
      handleProductCodeChange();
    }
  }, [productStore.productForm.supplierId]);

  // Hàm sinh autoBarCode mới
  const handleAutoBarCode = ({
    supplierId,
    orderNumber,
    patternId,
    surfaceId,
  }: {
    supplierId?: number;
    orderNumber?: string | number | null;
    patternId?: number;
    surfaceId?: number;
  }) => {
    if (!supplierId || !orderNumber) return "";
    const supplier = productSupplierList.find((x) => x.id === supplierId);
    const pattern = productPatternList.find((x) => x.id === patternId);
    const surface = productSurfaceList.find((x) => x.id === surfaceId);
    if (!supplier?.supplierShortCode) return "";
    const patternCode = pattern?.shortCode || "";
    const surfaceCode = surface?.shortCode || "";
    return `${surfaceCode}.${patternCode}.${supplier.supplierShortCode}.${orderNumber}`;
  };

  // Add effect để cập nhật autoBarCode khi các trường liên quan thay đổi
  useEffect(() => {
    if (isCreateMode) {
      const newBarCode = handleAutoBarCode({
        supplierId: productStore.productForm.supplierId ?? undefined,
        orderNumber:
          (isOnline
            ? productStore.productForm.productOrderNumber
            : manualOrderNumber) ?? undefined,
        patternId: productStore.productForm.brickPatternId ?? undefined,
        surfaceId: productStore.productForm.surfaceFeatureId ?? undefined,
      });
      productStore.updateProductForm("autoBarCode", newBarCode);
    }
  }, [
    isCreateMode,
    productStore.productForm.supplierId,
    productStore.productForm.productOrderNumber,
    manualOrderNumber,
    productStore.productForm.brickPatternId,
    productPatternList,
    productSupplierList,
    isOnline,
  ]);

  const handleProductCodeChange = () => {
    if (
      productStore.productForm.supplierId &&
      (productStore.productForm.productOrderNumber || manualOrderNumber)
    ) {
      const supplier = productSupplierList.find(
        (x) => x.id === productStore.productForm.supplierId
      );
      if (supplier?.supplierShortCode) {
        const orderNumber = isOnline
          ? productStore.productForm.productOrderNumber
          : manualOrderNumber;
        const newProductCode = `${supplier.supplierShortCode}.${orderNumber}`;
        productStore.updateProductForm("productCode", newProductCode);
      }
    }
  };

  // Add effect to update product code when supplier or order number changes
  useEffect(() => {
    if (isCreateMode) {
      handleProductCodeChange();
    }
  }, [
    isCreateMode,
    productStore.productForm.supplierId,
    productStore.productForm.productOrderNumber,
    manualOrderNumber,
  ]);

  const handleManualOrderNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setManualOrderNumber(value);
    const numericValue = parseInt(value) || 0;
    productStore.updateProductForm("productOrderNumber", numericValue);
    handleProductCodeChange();
    handleAutoBarCode({
      supplierId: productStore.productForm.supplierId ?? undefined,
      orderNumber: numericValue ?? undefined,
      patternId: productStore.productForm.brickPatternId ?? undefined,
      surfaceId: productStore.productForm.surfaceFeatureId ?? undefined,
    });
  };

  const handleWebsiteProductNameChange = () => {
    if (
      productStore.productForm.autoBarCode &&
      productStore.productForm.supplierId &&
      productStore.productForm.brickPatternId &&
      productStore.productForm.actualSizeId &&
      productStore.productForm.colorId &&
      productStore.productForm.brickBodyId &&
      productStore.productForm.materialId &&
      productStore.productForm.surfaceFeatureId
    ) {
      const pattern = productPatternList.find(
        (x) => x.id === productStore.productForm.brickPatternId
      );

      const size = productSizeList.find(
        (x) => x.id === productStore.productForm.actualSizeId
      );

      const actualSize = size
        ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
        : "";

      // const color = productColorList.find(
      //   (x) => x.id === productStore.productForm.colorId
      // );

      // const bodyColor = productBodyColorList.find(
      //   (x) => x.id === productStore.productForm.brickBodyId
      // );

      // const material = productMaterialList.find(
      //   (x) => x.id === productStore.productForm.materialId
      // );

      // const surfaceFeature = productSurfaceList.find(
      //   (x) => x.id === productStore.productForm.surfaceFeatureId
      // );

      if (pattern?.name) {
        const newWebsiteProductName =
          // `${productStore.productForm.autoBarCode} - ${actualSize} - ${pattern.name} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
          `${productStore.productForm.autoBarCode} - ${actualSize} - ${pattern.name}`.trim();
        setWebsiteProductName(newWebsiteProductName);
        productStore.updateProductForm(
          "displayWebsiteName",
          newWebsiteProductName
        );
      }
    }
  };

  const handleSapoNameChange = () => {
    if (
      productStore.productForm.brickPatternId &&
      productStore.productForm.colorId &&
      productStore.productForm.surfaceFeatureId &&
      productStore.productForm.originCountryId &&
      productStore.productForm.companyCodeId &&
      productStore.productForm.actualSizeId
    ) {
      const pattern = productPatternList.find(
        (x) => x.id === productStore.productForm.brickPatternId
      );

      const originCountry = productOriginList.find(
        (x) => x.id === productStore.productForm.originCountryId
      );

      const color = productColorList.find(
        (x) => x.id === productStore.productForm.colorId
      );

      const size = productSizeList.find(
        (x) => x.id === productStore.productForm.actualSizeId
      );
      const sizeString = size ? `${Number(size.wide) / 10}x${Number(size.length) / 10}` : "";

      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === productStore.productForm.surfaceFeatureId
      );

      const companyCode = productCompanyCodeList.find(
        (x) => x.id === productStore.productForm.companyCodeId
      );
      
      // Lấy supplier để kiểm tra loại
      const supplier = productSupplierList.find(
        (x) => x.id === productStore.productForm.supplierId
      );
      
      // Lấy factory
      const factory = productFactoryList.find(
        (x) => x.id === productStore.productForm.productFactoryId
      );
      const factoryShortName = factory?.name?.split("/")[0]?.trim() || "";
      
      // Lấy mã ngắn công ty (trước TCT)
      const codeName = companyCode?.codeName;
      let codeNameResult = "";
      if (codeName) {
        const akIndex = codeName.indexOf(barcode);
        if (akIndex !== -1) {
          codeNameResult = codeName.substring(0, akIndex);
        } else {
          codeNameResult = codeName;
        }
      }
      // Thêm shelfCode nếu có
      const shelfCode = productStore.productForm.shelfCode;
      if (shelfCode && shelfCode.trim()) {
        codeNameResult = `${codeNameResult} (${shelfCode.trim()})`;
      }
      // Xác định phần product name: englishName + supplierItemCode hoặc chỉ supplierItemCode
      let productNamePart = "";
      const englishName = productStore.productForm.productSpecialNote;
      const supplierItemCode = productStore.productForm.supplierItemCode;
      
      if (englishName && englishName.trim()) {
        // Nếu có englishName thì dùng englishName + supplierItemCode (chỉ khi khác nhau)
        const trimmedEnglishName = englishName.trim();
        const trimmedSupplierItemCode = supplierItemCode?.trim();
        
        if (trimmedSupplierItemCode && trimmedEnglishName !== trimmedSupplierItemCode) {
          // Chỉ thêm supplierItemCode nếu nó khác với englishName
          productNamePart = `${trimmedEnglishName} ${trimmedSupplierItemCode}`;
        } else {
          // Nếu giống nhau hoặc không có supplierItemCode thì chỉ dùng englishName
          productNamePart = trimmedEnglishName;
        }
      } else if (supplierItemCode) {
        // Nếu không có englishName thì chỉ dùng supplierItemCode
        productNamePart = supplierItemCode;
      }

      if (productNamePart && codeNameResult) {
        const surfaceShortName = getSurfaceShortName(surfaceFeature);
        let newSapoProductName =
          `${codeNameResult} - ${productNamePart} - ${originCountry?.upperName} - ${sizeString} - ${color?.name},${pattern?.shortCode},${surfaceShortName}`.trim();
        
        // Logic mới: Kiểm tra supplier có phải nhà máy không qua isFactory field
        if (supplier?.isFactory === true) {
          // Nếu supplier là nhà máy (isFactory = true), thêm tên supplier
          if (supplier.supplierName) {
            newSapoProductName += ` - ${supplier.supplierName}`;
          }
        } else if (supplier?.isFactory === false && factoryShortName) {
          // Nếu supplier không phải nhà máy (isFactory = false) và có factory, thêm tên nhà máy
          newSapoProductName += ` - ${factoryShortName}`;
        }
        
        setSapo(newSapoProductName);
        productStore.updateProductForm("sapoName", newSapoProductName);
      }
    }
  };

  useEffect(() => {
    if (isCreateMode) {
      handleWebsiteProductNameChange();
      handleSapoNameChange();
    }
  }, [
    isCreateMode,
    productStore.productForm.autoBarCode,
    productStore.productForm.brickPatternId,
    productStore.productForm.actualSizeId,
    productStore.productForm.colorId,
    productStore.productForm.brickBodyId,
    productStore.productForm.materialId,
    productStore.productForm.surfaceFeatureId,
    productStore.productForm.productSpecialNote,
    productStore.productForm.supplierItemCode,
    productStore.productForm.shelfCode,
    productStore.productForm.productFactoryId,
    productStore.productForm.supplierId,
  ]);

  const handleOtherNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherNote(e.target.value);
    productStore.updateProductForm("otherNote", e.target.value);
  };

  const handleDeliveryEstimatedDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setDeliveryEstimatedDate(value);
    if (isCreateMode) {
      productStore.updateProductForm("deliveryEstimatedDate", value);
    } else {
      if (onChange) {
        onChange("deliveryEstimatedDate", value);
      }
    }
  };

  // Debounced check function
  const debouncedCheck = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setIsValidSupplierCode(null);
        onValidationChange && onValidationChange("supplierItemCode", "true");
        return;
      }
      setIsChecking(true);
      try {
        const response = await productStore.checkSupplierItemCode(value);
        // Response là boolean: true = không có mã trùng (hợp lệ), false = có mã trùng (không hợp lệ)
        const isValid = response === true;
        setIsValidSupplierCode(isValid);

        // Gửi trạng thái validation về component cha
        if (onValidationChange) {
          if (isValid) {
            onValidationChange("supplierItemCode", "true");
          } else {
            onValidationChange("supplierItemCode", "false");
          }
        }
      } catch (error) {
        console.error("Error checking supplier code:", error);
        setIsValidSupplierCode(false);
        toast.error("Lỗi khi kiểm tra mã sản phẩm");
        onValidationChange &&
          onValidationChange(
            "supplierItemCode",
            "false",
            "Lỗi khi kiểm tra mã sản phẩm"
          );
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [onValidationChange]
  );

  const handleSupplierItemCodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;

    if (isCreateMode) {
      // Xử lý cập nhật cho chế độ tạo mới
      setSupplierItemCode(newValue);
      productStore.updateProductForm("supplierItemCode", newValue);
    } else {
      // Xử lý cập nhật cho chế độ chỉnh sửa (Edit mode)
      if (onChange) {
        onChange("supplierItemCode", newValue);
      }
    }

    // Vẫn gọi hàm kiểm tra trùng lặp mã cho cả 2 trường hợp
    debouncedCheck(newValue);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const handleCreateWeightPerUnitChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const newWeightPerUnit = Number(e.target.value);
  const quantity = productStore.productForm.quantityPerBox ?? 0;
  const newWeightPerBox = Number((newWeightPerUnit * quantity).toFixed(5));

  productStore.updateProductForm("weightPerUnit", newWeightPerUnit);
  productStore.updateProductForm("weightPerBox", newWeightPerBox);
};

const handleCreateQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newQuantity = Number(e.target.value);
  const weightPerUnit = productStore.productForm.weightPerUnit ?? 0;
  const newWeightPerBox = Number((weightPerUnit * newQuantity).toFixed(5));

  productStore.updateProductForm("quantityPerBox", newQuantity);
  productStore.updateProductForm("weightPerBox", newWeightPerBox);
  };

  const handleEditQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    // Use product?.areaPerUnit, fallback to 0 if not available
    const areaPerUnit = product?.areaPerUnit ?? 0;
    const newAreaPerBox = Number((areaPerUnit * newQuantity).toFixed(5));
    const newWeightPerBox = Number((product?.weightPerUnit ?? 0) * newQuantity);
    if (onChange) {
      onChange("quantityPerBox", newQuantity);
      onChange("areaPerBox", newAreaPerBox);
      onChange("weightPerBox", newWeightPerBox);
    }
  };

  const handleEditWeightPerUnitChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newWeightPerUnit = Number(e.target.value);
    const newWeightPerBox = Number(
      (newWeightPerUnit * (product?.quantityPerBox ?? 0)).toFixed(5)
    );
    if (onChange) {
      onChange("weightPerUnit", newWeightPerUnit);
      onChange("weightPerBox", newWeightPerBox);
    }
  };

  useEffect(() => {
    if (isCreateMode && productStore.productForm.supplierId) {
      // Tạo mới: luôn lấy orderNumber mới
      getNextOrderNumberAuto();
    } else if (
      !isCreateMode &&
      product &&
      product.supplierId !== productStore.productForm.supplierId
    ) {
      // Edit: chỉ khi đổi supplier mới lấy orderNumber mới
      getNextOrderNumberAuto();
    }
    // Các trường hợp khác KHÔNG gọi getNextOrderNumberAuto!
  }, [isCreateMode, productStore.productForm.supplierId]);

  // Đồng bộ Barcode, ProductCode và Tên Website khi các trường liên quan thay đổi trong edit mode
  useEffect(() => {
    if (!isCreateMode && product && onChange) {
      const supplier = productSupplierList.find(
        (x) => x.id === product.supplierId
      );
      const pattern = productPatternList.find(
        (x) => x.id === product.brickPatternId
      );
      const surface = productSurfaceList.find(
        (x) => x.id === product.surfaceFeatureId
      );

      if (supplier?.supplierShortCode && pattern && product.productOrderNumber !== undefined) {
        const currentOrderNumber = product.productOrderNumber;
        const patternCode = pattern.shortCode || "";
        const surfaceCode = surface?.shortCode || "";
        const newBarCode = `${surfaceCode}.${patternCode}.${supplier.supplierShortCode}.${currentOrderNumber}`;
        const newProductCode = `${supplier.supplierShortCode}.${currentOrderNumber}`;
        
        if (product.autoBarCode !== newBarCode) {
          onChange("autoBarCode", newBarCode);
          onChange("confirmAutoBarCode", newBarCode);
        }
        if (product.productCode !== newProductCode) {
          onChange("productCode", newProductCode);
          onChange("confirmProductCode", newProductCode);
        }

        if (!isDisplayWebsiteNameManuallyEdited) {
          updateDisplayWebsiteName(currentOrderNumber);
        }
      }
    }
  }, [
    isCreateMode,
    product?.supplierId,
    product?.brickPatternId,
    product?.surfaceFeatureId,
    product?.productOrderNumber,
    product?.autoBarCode,
    product?.productCode,
    product?.colorId,
    product?.brickBodyId,
    product?.materialId,
    product?.actualSizeId,
    isDisplayWebsiteNameManuallyEdited,
    productSupplierList,
    productPatternList,
    productSurfaceList,
    productSizeList,
    productColorList,
    productBodyColorList,
    productMaterialList,
    onChange
  ]);

  // Hàm helper để cập nhật displayWebsiteName
  const updateDisplayWebsiteName = (
    orderNumber: string | number | undefined
  ) => {
    if (
      product?.supplierId &&
      product?.brickPatternId &&
      product?.actualSizeId &&
      product?.colorId &&
      product?.brickBodyId &&
      product?.materialId &&
      product?.surfaceFeatureId &&
      orderNumber !== undefined
    ) {
      const supplier = productSupplierList.find(
        (x) => x.id === product.supplierId
      );
      
      const pattern = productPatternList.find(
        (x) => x.id === product.brickPatternId
      );

      const size = productSizeList.find(
        (x) => x.id === product.actualSizeId
      );

      // const color = productColorList.find(
      //   (x) => x.id === product.colorId
      // );

      // const bodyColor = productBodyColorList.find(
      //   (x) => x.id === product.brickBodyId
      // );

      // const material = productMaterialList.find(
      //   (x) => x.id === product.materialId
      // );

      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === product.surfaceFeatureId
      );

      const actualSize = size
        ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
        : "";

      if (pattern?.name && supplier?.supplierShortCode) {
        const patternCode = pattern.shortCode || "";
        const surfaceCode = surfaceFeature?.shortCode || "";
        const autoBarCode = `${surfaceCode}.${patternCode}.${supplier.supplierShortCode}.${orderNumber}`;
        const newWebsiteProductName =
        //  `${autoBarCode} - ${actualSize} - ${pattern.name} ${color?.name} ${surfaceFeature?.name} ${material?.name} ${bodyColor?.name}`.trim();
        `${autoBarCode} - ${actualSize} - ${pattern.name}`.trim();
        if (onChange && !isDisplayWebsiteNameManuallyEdited) {
          if (product.displayWebsiteName !== newWebsiteProductName) {
            onChange("displayWebsiteName", newWebsiteProductName);
          }
        }
      }
    }
  };

  // Hàm cập nhật tên Mã Dự Án cho edit mode
  const updateSapoNameForEdit = () => {
    if (
      product?.brickPatternId &&
      product?.colorId &&
      product?.surfaceFeatureId &&
      product?.originCountryId &&
      product?.companyCodeId &&
      product?.actualSizeId
    ) {
      const pattern = productPatternList.find(
        (x) => x.id === product.brickPatternId
      );

      const originCountry = productOriginList.find(
        (x) => x.id === product.originCountryId
      );

      const color = productColorList.find((x) => x.id === product.colorId);

      const size = productSizeList.find(
        (x) => x.id === product.actualSizeId
      );
      const sizeString = size ? `${Number(size.wide) / 10}x${Number(size.length) / 10}` : "";

      const surfaceFeature = productSurfaceList.find(
        (x) => x.id === product.surfaceFeatureId
      );

      const companyCode = productCompanyCodeList.find(
        (x) => x.id === product.companyCodeId
      );
      
      // Lấy supplier để kiểm tra loại
      const supplier = productSupplierList.find(
        (x) => x.id === product.supplierId
      );
      
      // Lấy factory
      const factory = productFactoryList.find((x) => x.id === product.productFactoryId);
      const factoryShortName = factory?.name?.split("/")[0]?.trim() || "";
      
      // Lấy mã ngắn công ty (trước TCT)
      const codeName = companyCode?.codeName;
      let codeNameResult = "";
      if (codeName) {
        const akIndex = codeName.indexOf(barcode);
        if (akIndex !== -1) {
          codeNameResult = codeName.substring(0, akIndex);
        } else {
          codeNameResult = codeName;
        }
      }
      // Thêm shelfCode nếu có
      const shelfCode = product.shelfCode;
      if (shelfCode && shelfCode.trim()) {
        codeNameResult = `${codeNameResult} (${shelfCode.trim()})`;
      }
      // Xác định phần product name: englishName + supplierItemCode hoặc chỉ supplierItemCode
      let productNamePart = "";
      const englishName = product.productSpecialNote;
      const supplierItemCode = product.supplierItemCode;
      
      if (englishName && englishName.trim()) {
        // Nếu có englishName thì dùng englishName + supplierItemCode (chỉ khi khác nhau)
        const trimmedEnglishName = englishName.trim();
        const trimmedSupplierItemCode = supplierItemCode?.trim();
        
        if (trimmedSupplierItemCode && trimmedEnglishName !== trimmedSupplierItemCode) {
          // Chỉ thêm supplierItemCode nếu nó khác với englishName
          productNamePart = `${trimmedEnglishName} ${trimmedSupplierItemCode}`;
        } else {
          // Nếu giống nhau hoặc không có supplierItemCode thì chỉ dùng englishName
          productNamePart = trimmedEnglishName;
        }
      } else if (supplierItemCode) {
        // Nếu không có englishName thì chỉ dùng supplierItemCode
        productNamePart = supplierItemCode;
      }

      if (productNamePart && codeNameResult) {
        const surfaceShortName = getSurfaceShortName(surfaceFeature);
        let newSapoProductName =
          `${codeNameResult} - ${productNamePart} - ${originCountry?.upperName} - ${sizeString} - ${color?.name},${pattern?.shortCode},${surfaceShortName}`.trim();
        
        // Logic mới: Kiểm tra supplier có phải nhà máy không qua isFactory field
        if (supplier?.isFactory === true) {
          // Nếu supplier là nhà máy (isFactory = true), thêm tên supplier
          if (supplier.supplierName) {
            newSapoProductName += ` - ${supplier.supplierName}`;
          }
        } else if (supplier?.isFactory === false && factoryShortName) {
          // Nếu supplier không phải nhà máy (isFactory = false) và có factory, thêm tên nhà máy
          newSapoProductName += ` - ${factoryShortName}`;
        }
        
        if (onChange) {
          if (product.sapoName !== newSapoProductName) {
            onChange("sapoName", newSapoProductName);
          }
        }
      }
    }
  };

  // Thêm hàm generateSku
  const generateSku = ({
    companyCodeId,
    supplierId,
    supplierItemCode,
    surfaceFeatureId,
    brickPatternId,
    productSpecialNote,
    companyCodeList,
    supplierList,
    surfaceList,
    patternList,
  }: {
    companyCodeId?: number;
    supplierId?: number;
    supplierItemCode?: string;
    surfaceFeatureId?: number;
    brickPatternId?: number;
    productSpecialNote?: string;
    companyCodeList: any[];
    supplierList: any[];
    surfaceList: any[];
    patternList: any[];
  }) => {
    const companyCode = companyCodeList.find((x) => x.id === companyCodeId);
    const supplier = supplierList.find((x) => x.id === supplierId);
    const surface = surfaceList.find((x) => x.id === surfaceFeatureId);
    const pattern = patternList.find((x) => x.id === brickPatternId);
    if (!companyCode || !supplier || !surface || !pattern) return "";
    
    // Xác định phần thứ 3: englishName hoặc 6 ký tự cuối supplierItemCode
    let thirdPart = "";
    if (productSpecialNote && productSpecialNote.trim()) {
      // Nếu có englishName thì dùng full englishName
      thirdPart = productSpecialNote.trim();
    } else if (supplierItemCode && supplierItemCode.length >= 6) {
      // Nếu không có englishName thì lấy 6 ký tự cuối của supplierItemCode
      thirdPart = supplierItemCode.slice(-6);
    } else if (supplierItemCode) {
      // Nếu supplierItemCode ngắn hơn 6 ký tự thì lấy toàn bộ
      thirdPart = supplierItemCode;
    }
    
    if (!thirdPart) return "";
    
    return `${companyCode.codeName}-${surface.shortCode}-${pattern.shortCode}-${thirdPart}`;
  };

  // Tạo state cho SKU nếu cần
  const [sku, setSku] = useState("");

  // useEffect cho create mode
  useEffect(() => {
    if (isCreateMode) {
      const newSku = generateSku({
        companyCodeId: productStore.productForm.companyCodeId ?? undefined,
        supplierId: productStore.productForm.supplierId ?? undefined,
        supplierItemCode: supplierItemCode,
        surfaceFeatureId:
          productStore.productForm.surfaceFeatureId ?? undefined,
        brickPatternId: productStore.productForm.brickPatternId ?? undefined,
        productSpecialNote: productStore.productForm.productSpecialNote ?? undefined,
        companyCodeList: productCompanyCodeList,
        supplierList: productSupplierList,
        surfaceList: productSurfaceList,
        patternList: productPatternList,
      });
      setSku(newSku);
      productStore.updateProductForm("confirmSupplierItemCode", newSku);
    }
  }, [
    isCreateMode,
    productStore.productForm.companyCodeId,
    productStore.productForm.supplierId,
    supplierItemCode,
    productStore.productForm.surfaceFeatureId,
    productStore.productForm.brickPatternId,
    productStore.productForm.productSpecialNote,
    productCompanyCodeList,
    productSupplierList,
    productSurfaceList,
    productPatternList,
  ]);

  // useEffect cho edit mode
  useEffect(() => {
    if (!isCreateMode && product) {
      const newSku = generateSku({
        companyCodeId: product.companyCodeId ?? undefined,
        supplierId: product.supplierId ?? undefined,
        supplierItemCode: product.supplierItemCode,
        surfaceFeatureId: product.surfaceFeatureId ?? undefined,
        brickPatternId: product.brickPatternId ?? undefined,
        productSpecialNote: product.productSpecialNote ?? undefined,
        companyCodeList: productCompanyCodeList,
        supplierList: productSupplierList,
        surfaceList: productSurfaceList,
        patternList: productPatternList,
      });
      setSku(newSku);
      if (onChange) {
        if (product.confirmSupplierItemCode !== newSku) {
          onChange("confirmSupplierItemCode", newSku);
        }
      }
    }
  }, [
    isCreateMode,
    product?.companyCodeId,
    product?.supplierId,
    product?.supplierItemCode,
    product?.surfaceFeatureId,
    product?.brickPatternId,
    product?.productSpecialNote,
    productCompanyCodeList,
    productSupplierList,
    productSurfaceList,
    productPatternList,
  ]);

  // useEffect để cập nhật tên SAPO khi các trường liên quan thay đổi trong edit mode
  useEffect(() => {
    if (!isCreateMode && product && !isSapoNameManuallyEdited) {
      updateSapoNameForEdit();
    }
  }, [
    isCreateMode,
    product?.productSpecialNote,
    product?.supplierItemCode,
    product?.shelfCode,
    product?.brickPatternId,
    product?.colorId,
    product?.materialId,
    product?.actualSizeId,
    product?.surfaceFeatureId,
    product?.originCountryId,
    product?.companyCodeId,
    product?.supplierId,
    productPatternList,
    productColorList,
    productMaterialList,
    productSizeList,
    productSurfaceList,
    productOriginList,
    productCompanyCodeList,
    productFactoryList,
    productSupplierList,
  ]);

  return (
    <ComponentCard title="Thông tin mã hàng">
      {isCreateMode ? (
        <>
          {/* PHẦN 1: 2 cột */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã TCT</ProductLabel>
                <CompanyCodeGroup
                  product={product}
                  isCreateMode={isCreateMode}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Tên tiếng anh</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  placeholder="English name"
                  value={
                    isCreateMode
                      ? productStore.productForm.productSpecialNote || ""
                      : product?.productSpecialNote || ""
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (isCreateMode) {
                      productStore.updateProductForm(
                        "productSpecialNote",
                        value,
                      );
                    } else {
                      if (onChange) {
                        onChange("productSpecialNote", value);
                      }
                    }
                  }}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={sku}
                  onChange={() => {}}
                />
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã gốc nhà cung cấp</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  value={
                    isCreateMode
                      ? supplierItemCode
                      : product?.supplierItemCode || ""
                  }
                  placeholder="Mã số sản phẩm của nhà cung cấp"
                  onChange={handleSupplierItemCodeChange}
                  className={`${
                    isValidSupplierCode === null
                      ? ""
                      : isValidSupplierCode
                        ? "text-blue-500" // Hoặc bỏ trống nếu không cần đổi màu khi hợp lệ
                        : "text-red-500"
                  } ${isChecking ? "opacity-50" : ""}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
                  {isOnline && productStore.productForm.productOrderNumber ? (
                    <Input
                      type="number"
                      id="input"
                      placeholder="Số thứ tự tự động"
                      disabled
                      value={productStore.productForm.productOrderNumber || ""}
                    />
                  ) : (
                    <Input
                      type="text"
                      id="input"
                      placeholder="Nhập số thứ tự"
                      value={manualOrderNumber}
                      onChange={handleManualOrderNumberChange}
                    />
                  )}
                </div>
                <div>
                  <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Mã sản phẩm"
                    disabled
                    value={productStore.productForm.productCode || ""}
                  />
                </div>
              </div>
              <div>
                <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={productStore.productForm.autoBarCode}
                  className="text-red-500"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 2: Tên Mã Dự Án và Tên hiển thị website */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel htmlFor="input">Tên Mã Dự Án</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên Mã Dự Án"
                value={product?.sapoName || sapo || ""}
                disabled={isCreateMode === true}
                onChange={handleWebsiteProductNameChange}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Ô tự động điền"
                className="text-red-500 w-full"
                value={product?.displayWebsiteName || websiteProductName || ""}
                disabled={isCreateMode === true}
                onChange={handleWebsiteProductNameChange}
              />
            </div>
          </div>

          {/* PHẦN 3: 2 cột */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
                <CalculatedUnit product={product} isCreateMode={isCreateMode} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">
                    Khối lượng KG/Viên
                  </ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Ô tự động điền"
                    onChange={handleCreateWeightPerUnitChange}
                    value={productStore.productForm.weightPerUnit ?? ""}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Số lượng</ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Ô tự động điền"
                    onChange={handleCreateQuantityChange}
                    value={productStore.productForm.quantityPerBox ?? ""}
                  />
                </div>
              </div>
              {/* Giao hàng tại và Số ngày giao hàng cùng 1 row 2 col */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
                  <StorageGroup product={product} isCreateMode={isCreateMode} />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Số ngày giao hàng"
                    value={deliveryEstimatedDate}
                    onChange={handleDeliveryEstimatedDateChange}
                  />
                </div>
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  className="text-red-500"
                  value={productStore.productForm.autoCalculatedUnit || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Diện tích 1 viên</ProductLabel>
                  <Input
                    type="number"
                    step={0.05}
                    id="input"
                    disabled
                    placeholder="Ô tự động điền"
                    value={product?.areaPerUnit}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Diện tích 1 thùng</ProductLabel>
                  <Input
                    type="number"
                    step={0.05}
                    id="input"
                    disabled
                    placeholder="Ô tự động điền"
                    value={product?.areaPerBox}
                  />
                </div>
              </div>
              <div>
                <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
                <FactoryGroup product={product} isCreateMode={isCreateMode} />
              </div>
            </div>
          </div>

          {/* PHẦN 4: Gia công khác và Ghi chú thêm */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup product={product} isCreateMode={isCreateMode} />
            </div>
            <div>
              <ProductLabel htmlFor="input">Link Google Keep</ProductLabel>
              <ProductTextArea
                placeholder="Ghi chú thêm"
                value={otherNote}
                onChange={handleOtherNoteChange}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* PHẦN 1: 2 cột */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã TCT</ProductLabel>
                <CompanyCodeGroup
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Tên tiếng anh</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  placeholder="English name"
                  value={product?.productSpecialNote || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (onChange) {
                      onChange("productSpecialNote", value);
                    }
                  }}
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={sku}
                />
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Mã gốc nhà cung cấp</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  value={
                    isCreateMode
                      ? supplierItemCode
                      : product?.supplierItemCode || ""
                  }
                  placeholder="Mã số sản phẩm của nhà cung cấp"
                  onChange={handleSupplierItemCodeChange}
                  className={`${
                    isValidSupplierCode === null
                      ? ""
                      : isValidSupplierCode
                        ? "text-blue-500" // Hoặc bỏ trống nếu không cần đổi màu khi hợp lệ
                        : "text-red-500"
                  } ${isChecking ? "opacity-50" : ""}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Số thứ tự tự động"
                    disabled
                    value={product?.productOrderNumber || ""}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Mã sản phẩm"
                    disabled
                    value={product?.productCode || undefined}
                  />
                </div>
              </div>
              <div>
                <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  value={product?.autoBarCode}
                  className="text-red-500"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 2: Tên Mã Dự Án và Tên hiển thị website */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel htmlFor="input">Tên Mã Dự Án</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên Mã Dự Án"
                value={product?.sapoName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("sapoName", e.target.value);
                    // Đánh dấu rằng người dùng đã chỉnh sửa thủ công
                    setIsSapoNameManuallyEdited(true);
                  }
                }}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên website"
                value={product?.displayWebsiteName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("displayWebsiteName", e.target.value);
                    // Đánh dấu rằng người dùng đã chỉnh sửa thủ công
                    setIsDisplayWebsiteNameManuallyEdited(true);
                  }
                }}
              />
            </div>
          </div>

          {/* PHẦN 3: 2 cột */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Cột trái */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">
                  Giá sản phẩm website
                </ProductLabel>
                <NumericFormat
                  value={product?.retailPrice}
                  thousandSeparator
                  prefix={appCurrency}
                  allowNegative={false}
                  displayType="input"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    if (onChange) {
                      onChange("retailPrice", floatValue ?? 0);
                    }
                  }}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
                <CalculatedUnit
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">
                    Khối lượng KG/Viên
                  </ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Ô tự động điền"
                    onChange={handleEditWeightPerUnitChange}
                    value={product?.weightPerUnit}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Số lượng</ProductLabel>
                  <Input
                    type="number"
                    id="input"
                    placeholder="Ô tự động điền"
                    onChange={handleEditQuantityChange}
                    value={product?.quantityPerBox}
                  />
                </div>
              </div>
              {/* Giao hàng tại và Số ngày giao hàng cùng 1 row 2 col */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
                  <StorageGroup
                    product={product}
                    isCreateMode={isCreateMode}
                    onChange={onChange}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
                  <Input
                    type="text"
                    id="input"
                    placeholder="Số ngày giao hàng"
                    value={deliveryEstimatedDate}
                    onChange={handleDeliveryEstimatedDateChange}
                  />
                </div>
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-6">
              <div>
                <ProductLabel htmlFor="input">Giá khuyến mãi</ProductLabel>
                <NumericFormat
                  value={product?.firstRemainingPriceAfterDiscount}
                  thousandSeparator
                  prefix={appCurrency}
                  allowNegative={false}
                  displayType="input"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    if (onChange) {
                      onChange("firstRemainingPriceAfterDiscount", floatValue ?? 0);
                    }
                  }}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                />
              </div>
              <div>
                <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
                <Input
                  type="text"
                  id="input"
                  disabled
                  placeholder="Ô tự động điền"
                  className="text-red-500"
                  value={product?.autoCalculatedUnit || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ProductLabel htmlFor="input">Diện tích 1 viên</ProductLabel>
                  <Input
                    type="number"
                    step={0.05}
                    id="input"
                    disabled
                    placeholder="Ô tự động điền"
                    value={product?.areaPerUnit}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="input">Diện tích 1 thùng</ProductLabel>
                  <Input
                    type="number"
                    step={0.05}
                    id="input"
                    disabled
                    placeholder="Ô tự động điền"
                    value={product?.areaPerBox}
                  />
                </div>
              </div>
              <div>
                <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
                <FactoryGroup
                  product={product}
                  isCreateMode={isCreateMode}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            <div className="space-y-0">
              <ProductLabel htmlFor="input">Mã TCT</ProductLabel>
              <CompanyCodeGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Tên tiếng anh</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="English name"
                value={product?.productSpecialNote || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (onChange) {
                    onChange("productSpecialNote", value);
                  }
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã gốc nhà cung cấp</ProductLabel>
              <Input
                type="text"
                id="input"
                value={
                  isCreateMode
                    ? supplierItemCode
                    : product?.supplierItemCode || ""
                }
                placeholder="Mã số sản phẩm của nhà cung cấp"
                onChange={handleSupplierItemCodeChange}
                className={`${
                  isValidSupplierCode === null
                    ? ""
                    : isValidSupplierCode
                      ? "text-blue-500" // Hoặc bỏ trống nếu không cần đổi màu khi hợp lệ
                      : "text-red-500"
                } ${isChecking ? "opacity-50" : ""}`}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Số thứ tự</ProductLabel>
              <Input
                type="number"
                id="input"
                placeholder="Số thứ tự tự động"
                disabled
                value={product?.productOrderNumber || ""}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã sản phẩm</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Mã sản phẩm"
                disabled
                value={product?.productCode || undefined}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã SKU</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                value={sku}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Mã barcode sản phẩm</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                value={product?.autoBarCode}
                className="text-red-500"
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Tên Mã Dự Án</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Tên Mã Dự Án"
                value={product?.sapoName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("sapoName", e.target.value);
                    // Đánh dấu rằng người dùng đã chỉnh sửa thủ công
                    setIsSapoNameManuallyEdited(true);
                  }
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Tên hiển thị website</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Ô tự động điền"
                className="text-red-500"
                value={product?.displayWebsiteName || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("displayWebsiteName", e.target.value);
                    // Đánh dấu rằng người dùng đã chỉnh sửa thủ công
                    setIsDisplayWebsiteNameManuallyEdited(true);
                  }
                }}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Đơn vị tính</ProductLabel>
              <CalculatedUnit
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Đơn vị tính tự động</ProductLabel>
              <Input
                type="text"
                id="input"
                disabled
                placeholder="Ô tự động điền"
                className="text-red-500"
                value={product?.autoCalculatedUnit || ""}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Giao hàng tại</ProductLabel>
              <StorageGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="input">Số ngày giao hàng</ProductLabel>
              <Input
                type="text"
                id="input"
                placeholder="Số ngày giao hàng"
                value={deliveryEstimatedDate}
                onChange={handleDeliveryEstimatedDateChange}
              />
            </div>

            <div>
              <ProductLabel htmlFor="factory">Nhà máy</ProductLabel>
              <FactoryGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>
          </div>

          {/* PHẦN 4: Gia công khác và Ghi chú thêm */}
          <div className="mt-6 space-y-6">
            <div>
              <ProductLabel>Gia công khác</ProductLabel>
              <ProcessingGroup
                product={product}
                isCreateMode={isCreateMode}
                onChange={onChange}
              />
            </div>
            <div>
              <ProductLabel htmlFor="input">Đường dẫn Google Keeps</ProductLabel>
              <ProductTextArea
                placeholder="Ghi chú thêm"
                value={product?.otherNote || ""}
                onChange={(e) => {
                  if (onChange) {
                    onChange("otherNote", e.target.value);
                  }
                }}
              />
            </div>
          </div>

          <ProcessingPriceModal
            isOpen={isProcessingPriceModalOpen}
            onClose={() => setIsProcessingPriceModalOpen(false)}
            product={product}
          />
        </>
      )}
    </ComponentCard>
  );
};

export default observer(ProductDefaultInputs);
