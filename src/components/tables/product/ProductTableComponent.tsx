import { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Badge from "../../ui/badge/Badge";
import {
  ProductDetail,
  ProductDto,
} from "../../../app/models/product/product.model.ts";
import { useNavigate } from "react-router";
import {
  appCurrency,
  convertKgPerM2,
  uploadWebsiteStatusToVietnamese,
} from "../../../app/common/common";
import {
  generateTechnicalInfo,
  getTechnicalInfoTemplate,
} from "../../../app/common/technicalInfoTemplates";
import Modal from "../../ui/modal/index.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import ProductLabel from "../../form/product-form/ProductLabel.tsx";
import ProductInputField from "../../form/product-form/input/product/ProductInputField.tsx";
import ProductTextArea from "../../form/product-form/input/product/ProductTextArea.tsx";
import { NumericFormat } from "react-number-format";
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { ProductSupplierDto } from "../../../app/models/product/productSupplier.model.ts";
import { FaEye } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { BsFileEarmarkPpt } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { BsQrCode } from "react-icons/bs";
import { useRef } from "react";

interface ProductTableComponentProps {
  data: ProductDto[];
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  totalCount: number;
  pageSize?: number;
}

// Hàm tạo JSON cho nút Copy JSON
function generateProductJSON(
  product: ProductDetail,
  technicalInfo: string,
  storageName: string,
  surfaceList: any[],
  materialList: any[],
  colorList: any[],
  sizeList: any[],
  originList: any[]
) {
  const cleanSku = (product.confirmAutoBarCode || "").replace(/\./g, "");
  const saleEndDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 119)
    .toISOString()
    .slice(0, 10);

  // Lấy tên từ id
  const surfaceName =
    surfaceList.find((x) => x.id === product.surfaceFeatureId)?.name || "";
  const materialName =
    materialList.find((x) => x.id === product.materialId)?.name || "";
  const colorName = colorList.find((x) => x.id === product.colorId)?.name || "";
  const sizeLength =
    sizeList.find((x) => x.id === product.actualSizeId)?.length / 10 || 0;
  const sizeWide =
    sizeList.find((x) => x.id === product.actualSizeId)?.wide / 10 || 0;
  const originName =
    originList.find((x) => x.id === product.originCountryId)?.name || "";

  return {
    title: product.confirmAutoBarCode,
    description: technicalInfo,
    excerpt:
      "Giao hàng nhanh " +
      (product.deliveryEstimatedDate || "") +
      " _ " +
      (storageName || ""),
    sku: cleanSku,
    regular_price: product.productPrice ?? 0,
    sale_price: product.discountedPrice ?? 0,
    date_end_sale_price: saleEndDate,
    weight: product.weightPerUnit ?? 0,
    length: sizeWide,
    width: sizeLength,
    thick: product.thicknessSize ?? 0,
    item: product.quantityPerBox ?? 0,
    stripe: product.patternQuantity ?? 0,
    variations: [
      {
        attributes: {
          "be-mat": surfaceName,
          "chat-lieu": materialName,
          "madeby": originName,
          "mau-sac": colorName,
          "kich-thuoc": sizeWide + "x" + sizeLength + " cm",
        },
        price: product.productPrice ?? 0,
        sku: product.confirmAutoBarCode,
        item: product.quantityPerBox ?? 0,
      },
    ],
  };
}

const ProductTableComponent = ({
  data,
  loading,
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalCount,
  pageSize,
}: ProductTableComponentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSapoModalOpen, setIsSapoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetail | null>();
  const [technicalInfo, setTechnicalInfo] = useState("");
  const [storageCheckingCode, setStorageCheckingCode] = useState("");
  const [storageName, setStorageName] = useState("");
  const [productSurface, setProductSurface] = useState("");
  const [productOrigin, setProductOrigin] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productSize, setProductSize] = useState("");
  const [displayWebsiteName, setDisplayWebsiteName] = useState("");
  const [supplier, setSupplier] = useState<ProductSupplierDto>();
  const [productSizeSapo, setProductSizeSapo] = useState("");
  const [actualSize, setActualSize] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedQrProduct, setSelectedQrProduct] = useState<ProductDto | null>(null);
  const qrCardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {
    productStore,
    storageStore,
    waterAbsorptionStore,
    patternStore,
    sizeStore,
    surfaceStore,
    materialStore,
    colorStore,
    bodyColorStore,
    supplierStore,
    calculatedUnitStore,
    originStore,
    } = useStore();
  const { theme } = useTheme();
  useEffect(() => {
    console.log("datalist:", data);
    if (!selectedProduct) {
      setTechnicalInfo("");
      setStorageCheckingCode("");
      setStorageName("");
      setSupplier(undefined);
      return;
    }

    const storage = storageStore.productStorageList.find(
      (x) => x.id === selectedProduct?.storageId
    );
    setStorageName(storage?.name ?? "");

    const water = waterAbsorptionStore.productWaterAbsorptionList.find(
      (x) => x.id === selectedProduct?.waterAbsorptionId
    );
    const waterAbsorptionValue = water?.waterAbsoprtionLevel ?? "";

    const surface = surfaceStore.productSurfaceList.find(
      (x) => x.id === selectedProduct?.surfaceFeatureId
    );
    setProductSurface(surface?.name ?? "");

    const material = materialStore.productMaterialList.find(
      (x) => x.id === selectedProduct?.materialId
    );
    setProductMaterial(material?.name ?? "");

    const color = colorStore.productColorList.find(
      (c) => c.id == selectedProduct?.colorId
    );
    setProductColor(color?.name ?? "");

    const origin = originStore.productOriginList.find(
      (x) => x.id === selectedProduct?.originCountryId
    );
    setProductOrigin(origin?.name ?? "");

    const pattern = patternStore.productPatternList.find(
      (x) => x.id === selectedProduct?.brickPatternId
    );

    const size = sizeStore.productSizeList.find(
      (x) => x.id === selectedProduct?.actualSizeId
    );

    const bodyColor = bodyColorStore.productBodyColorList.find(
      (x) => x.id === selectedProduct?.brickBodyId
    );

    setActualSize(size
      ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm`
      : "");

    const sapoActualSize = size?.autoSized;
    const displayWebsiteSize =
      actualSize + " x " + selectedProduct.thicknessSize + " | mm";
    setProductSize(displayWebsiteSize);
    setProductSizeSapo(sapoActualSize ?? actualSize);

    setDisplayWebsiteName(
      `${selectedProduct.autoBarCode} - ${actualSize} - ${pattern?.name} ${color?.name} ${surface?.name} ${material?.name} ${bodyColor?.name}`.trim()
    );

    setStorageCheckingCode(
      selectedProduct.confirmAutoBarCode.replace(/\./g, "")
    );

    const supplier = supplierStore.productSupplierList.find(
      (x) => x.id === selectedProduct?.supplierId
    );
    setSupplier(supplier);

    const supplierName = selectedProduct?.supplierId
      ? supplierStore.productSupplierRegistry.get(selectedProduct.supplierId)?.supplierName ||
        supplierStore.productSupplierList.find((x) => x.id === selectedProduct.supplierId)
          ?.supplierName ||
        ""
      : "";

    // Sử dụng hệ thống template mới để tạo technical info
    if (selectedProduct) {
      const technicalInfoText = generateTechnicalInfo(
        selectedProduct,
        waterAbsorptionValue,
        sizeStore.productSizeList,
        colorStore.productColorList,
        surfaceStore.productSurfaceList,
        materialStore.productMaterialList,
        patternStore.productPatternList,
        bodyColorStore.productBodyColorList,
        supplierName
      );
      setTechnicalInfo(technicalInfoText);
    }
  }, [selectedProduct]);

  const handleView = (product: ProductDto) => {
    navigate("/products/detail/" + product.id);
  };

  const handleViewUploadWebsite = async (id: number) => {
    try {
      await productStore.loadProductDetail(id);
      setSelectedProduct(productStore.productDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleViewUploadSapo = async (id: number) => {
    try {
      await productStore.loadProductDetail(id);
      setSelectedProduct(productStore.productDetail);
      setIsSapoModalOpen(true);
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSapoModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenQr = (product: ProductDto) => {
    setSelectedQrProduct(product);
    setIsQrModalOpen(true);
  };

  const handleDownloadPng = async () => {
    if (qrCardRef.current && selectedQrProduct) {
      const canvas = await html2canvas(qrCardRef.current, { scale: 3 }); // scale: 3 giúp ảnh nét hơn
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `QR_${selectedQrProduct.confirmAutoBarCode}.png`;
      link.href = url;
      link.click();
    }
  };

  const columns: TableColumn<ProductDto>[] = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "70px",
      cell: (row) => {
        return (
          <button
            className="text-blue-600 dark:text-white hover:underline"
            onClick={() => handleView(row)}
          >
            {row.id}
          </button>
        );
      },
    },
    {
      name: "Ngày đăng",
      selector: (row) =>
        new Date(row.createdDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      sortable: true,
    },
    {
      name: "Kích thước",
      // Ép kiểu (row as any) để lấy object actualSize
      selector: (row) => (row as any).actualSize?.id || 0,
      sortable: true,
      maxWidth: "120px",
      cell: (row) => {
        const actualSize = (row as any).actualSize;

        // Kiểm tra xem object actualSize có tồn tại và có dữ liệu wide/length không
        if (actualSize && actualSize.wide != null && actualSize.length != null) {
          return `${Number(actualSize.wide) / 10} x ${Number(actualSize.length) / 10} cm`;
        }

        return "Chưa xác định";
      },
    },
    {
      name: "Mã hàng",
      selector: (row) => row.confirmAutoBarCode,
      sortable: true,
      minWidth: "150px",
      cell: (row) => {
        const isUploaded =
          Number(row.uploadWebsiteStatus) === 1 ||
          row.uploadWebsiteStatus === "Uploaded";
        return isUploaded ? (
          <a
            href={`https://tcthomemart.com/san-pham/${row.confirmAutoBarCode}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="underline">{row.confirmAutoBarCode}</span>
          </a>
        ) : (
          <span>{row.confirmAutoBarCode}</span>
        );
      },
    },
    {
      name: "Mã NCC",
      selector: (row) => row.supplierCode,
      minWidth: "130px",
      cell: (row) => {
        return (
          <div
            className=""
            data-tooltip-id="view-tooltip"
            data-tooltip-content={row.supplierCode}
          >
            {row.supplierCode
              ? row.supplierCode.slice(0, 10) + "..."
              : "Chưa có"}
          </div>
        );
      },
    },
    {
      name: "Mã gốc",
      selector: (row) => row.supplierItemCode,
      sortable: true,
      minWidth: "140px",
      wrap: false,
      cell: (row) => (
        <div className="w-full h-full flex items-center bg-blue-700 text-white py-2 pl-3">
          {row.supplierItemCode}
        </div>
      ),
    },
    {
      name: "Giá gốc",
      selector: (row) =>
        row.retailPrice?.toLocaleString()
          ? appCurrency + "" + row.retailPrice?.toLocaleString()
          : "Chưa có giá",
      sortable: true,
    },
    {
      name: "Giá KM 1",
      selector: (row) =>
        row.firstRemainingPriceAfterDiscount?.toLocaleString()
          ? appCurrency + "" + row.firstRemainingPriceAfterDiscount?.toLocaleString()
          : "Chưa có giá",
      sortable: true,
    },
    {
      name: "Đăng",
      selector: (row) => row.creator ?? "Chưa có",
      maxWidth: "70px",
    },
    {
      name: "Sửa",
      selector: (row) => row.modifier ?? "Chưa có",
      maxWidth: "70px",
    },
    {
      name: "Tình trạng Upload",
      selector: (row) => row.uploadWebsiteStatus,
      sortable: true,
      cell: (row) => {
        const isUploaded =
          Number(row.uploadWebsiteStatus) === 1 ||
          row.uploadWebsiteStatus === "Completed";
        return (
          <Badge size="xs" color={isUploaded ? "success" : "error"}>
            {uploadWebsiteStatusToVietnamese(row.uploadWebsiteStatus)}
          </Badge>
        );
      },
    },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUploadWebsite(row.id)}
            className="dark:text-blue-600 text-[#334355] hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Website"
          >
            <CgWebsite className="w-6 h-6 hover:opacity-50" />
          </button>
          <button
            onClick={() => handleViewUploadSapo(row.id)}
            className="dark:text-blue-600 text-emerald-500 hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Mã Dự Án"
          >
            <BsFileEarmarkPpt className="w-6 h-6 hover:opacity-50" />
          </button>
          <button
            onClick={() => handleView(row)}
            className="dark:text-blue-600 text-fuchsia-600 hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Chi tiết"
          >
            <FaEye className="w-6 h-6 hover:opacity-50" />
          </button>
          <button
            onClick={() => handleOpenQr(row)}
            className="dark:text-blue-600 text-orange-500 hover:underline font-medium"
            data-tooltip-id="view-tooltip"
            data-tooltip-content="Mã QR"
          >
            <BsQrCode className="w-6 h-6 hover:opacity-50" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: "180px",
    },
  ];

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-2 md:p-4">
        <DataTable
          theme={theme === "dark" ? "customDark" : "default"}
          columns={columns}
          data={data}
          pagination
          paginationServer
          paginationTotalRows={totalCount}
          paginationPerPage={pageSize || 10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          paginationDefaultPage={currentPage}
          onChangePage={onPageChange}
          onChangeRowsPerPage={(newPageSize) => {
            onPageSizeChange(newPageSize);
          }}
          responsive
          highlightOnHover
          striped
          selectableRows
          progressPending={loading}
          progressComponent={
            <div className="py-8 text-center font-semibold font-roboto w-full">
              Đang chờ...
            </div>
          }
          noDataComponent={
            <div className="py-8 text-center font-semibold font-roboto w-full">
              Không có dữ liệu.
            </div>
          }
          customStyles={{
            table: {
              style: {
                width: "100%",
              },
            },
          }}
        />
      </div>

      {/* Chỉ render 1 Tooltip duy nhất ở cuối component */}
      <Tooltip id="view-tooltip" className="text-md" />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="w-full max-w-[1100px] px-20"
      >
        <div className="p-4 max-h-[80vh] overflow-y-scroll">
          <h2 className="text-2xl font-bold my-5 text-center text-black dark:text-white">
            THÔNG TIN WEBSITE GẠCH ỐP LÁT
          </h2>
          {selectedProduct ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* First row - Short Code and Supplier Item Code */}
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Mã ngắn - sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.confirmAutoBarCode}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold text-red-500 mb-1">
                    Mã kiểm kho:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full text-red-500"
                    value={storageCheckingCode}
                  />
                </div>

                {/* Second row - Product Code */}
                <div className="col-span-2">
                  <ProductLabel className="text-md font-bold mb-1">
                    Mã sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={displayWebsiteName}
                  />
                </div>

                {/* Third row - Unit and Delivery Date */}
                <div>
                  <ProductLabel className="text-md font-bold text-red-500 mb-1">
                    ĐVT:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full italic text-red-500"
                    value={
                      "(Giá áp dụng trên mỗi " +
                      selectedProduct.autoCalculatedUnit.toLowerCase() +
                      ")"
                    }
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Thời gian giao hàng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      "Giao hàng nhanh " +
                      selectedProduct.deliveryEstimatedDate +
                      " _ " +
                      storageName
                    }
                  />
                </div>

                {/* Technical Info */}
                <div className="col-span-2">
                  <ProductLabel className="text-md font-bold mb-1">
                    Thông tin kỹ thuật:
                  </ProductLabel>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Template:{" "}
                      {selectedProduct
                        ? getTechnicalInfoTemplate(selectedProduct).name
                        : "Đang tải..."}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (selectedProduct) {
                            const water =
                              waterAbsorptionStore.productWaterAbsorptionList.find(
                                (x) =>
                                  x.id === selectedProduct?.waterAbsorptionId
                              );
                            const waterAbsorptionValue =
                              water?.waterAbsoprtionLevel ?? "";
                            const technicalInfoText = generateTechnicalInfo(
                              selectedProduct,
                              waterAbsorptionValue,
                              // Lấy danh sách các thuộc tính từ store
                              sizeStore.productSizeList,
                              colorStore.productColorList,
                              surfaceStore.productSurfaceList,
                              materialStore.productMaterialList,
                              patternStore.productPatternList,
                              bodyColorStore.productBodyColorList,
                              // Lấy tên nhà cung cấp từ supplierId
                              selectedProduct.supplierId
                                ? supplierStore.productSupplierRegistry.get(selectedProduct.supplierId)
                                    ?.supplierName ||
                                  supplierStore.productSupplierList.find(
                                    (x) => x.id === selectedProduct.supplierId
                                  )?.supplierName ||
                                  ""
                                : ""
                            );
                            //Default dynamic input template base on selected product
                            setTechnicalInfo(technicalInfoText);
                            //Change to static template
                          }
                        }}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Reset Template
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(technicalInfo);
                        }}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Copy HTML
                      </button>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                      >
                        {showPreview ? "Edit" : "Preview"}
                      </button>
                      <button
                        onClick={() => setTechnicalInfo("")}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) => prev + "<h1>Tiêu đề chính</h1>"
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      H1
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) => prev + "<h2>Tiêu đề phụ</h2>"
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      H2
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo((prev) => prev + "<p>Đoạn văn bản</p>")
                      }
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      P
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) => prev + "<ul><li>Mục danh sách</li></ul>"
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      UL
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) => prev + "<strong>Chữ đậm</strong>"
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Strong
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) =>
                            prev + '<a href="https://example.com">Liên kết</a>'
                        )
                      }
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Link
                    </button>
                    <button
                      onClick={() => setTechnicalInfo((prev) => prev + "<br>")}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      BR
                    </button>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1">
                    <span className="text-xs text-gray-500 mr-2">
                      Biến sản phẩm:
                    </span>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) =>
                            prev + selectedProduct?.confirmAutoBarCode || ""
                        )
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Mã SP
                    </button>

                    <button
                      onClick={() =>
                        setTechnicalInfo((prev) => prev + productSize)
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Kích thước
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo((prev) => prev + productColor)
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Màu sắc
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo((prev) => prev + productSurface)
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Bề mặt
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo((prev) => prev + productMaterial)
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Chất liệu
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) =>
                            prev +
                            (selectedProduct?.weightPerUnit?.toString() || "")
                        )
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Kg/viên
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) =>
                            prev +
                            (selectedProduct?.weightPerBox?.toString() || "")
                        )
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Kg/thùng
                    </button>
                    <button
                      onClick={() =>
                        setTechnicalInfo(
                          (prev) =>
                            prev +
                            (selectedProduct?.areaPerBox?.toString() || "")
                        )
                      }
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      M²/thùng
                    </button>
                  </div>
                  {showPreview ? (
                    <div
                      className="h-[300px] w-full text-lg border border-gray-300 bg-gray-100 p-4 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: technicalInfo }}
                    />
                  ) : (
                    <ProductTextArea
                      className="h-[300px] w-full text-lg"
                      value={technicalInfo}
                      onChange={(e) => setTechnicalInfo(e.target.value)}
                      placeholder="Thông tin kỹ thuật sẽ được tạo tự động từ template..."
                    />
                  )}
                </div>
              </div>

              <div>
                <ProductLabel className="text-md font-bold mb-1 text-red-500">
                  Hết hạn khuyến mãi ngày:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full font-bold"
                  value={new Date(
                    Date.now() + 1000 * 60 * 60 * 24 * 119
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  disabled
                />
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Price Information */}
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá sản phẩm:
                  </ProductLabel>
                  {selectedProduct.retailPrice !== null ? (
                    <NumericFormat
                      value={selectedProduct.retailPrice ?? 0}
                      thousandSeparator={isEditing ? false : true}
                      prefix={isEditing ? "" : appCurrency}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      allowNegative={false}
                      displayType="input"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  ) : (
                    <ProductInputField
                      value={"Chưa có giá"}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  )}
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá khuyến mãi 1:
                  </ProductLabel>
                  {selectedProduct.firstRemainingPriceAfterDiscount !== null ? (
                    <NumericFormat
                      value={selectedProduct.firstRemainingPriceAfterDiscount ?? 0}
                      thousandSeparator={isEditing ? false : true}
                      prefix={isEditing ? "" : appCurrency}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      allowNegative={false}
                      displayType="input"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  ) : (
                    <ProductInputField
                      value={"Chưa có giá"}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  )}
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá khuyến mãi 2:
                  </ProductLabel>
                  {selectedProduct.secondRemainingPriceAfterDiscount !== null ? (
                    <NumericFormat
                      value={selectedProduct.secondRemainingPriceAfterDiscount ?? 0}
                      thousandSeparator={isEditing ? false : true}
                      prefix={isEditing ? "" : appCurrency}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      allowNegative={false}
                      displayType="input"
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  ) : (
                    <ProductInputField
                      value={"Chưa có giá"}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-md shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Quantity and Weight Information */}
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Viên/thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.quantityPerBox + " Viên / Thùng"}
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Kg/thùng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.weightPerBox + " Kg / Thùng"}
                  />
                </div>
                <div className="col-span-4">
                  <ProductLabel className="text-md font-bold mb-1">
                    Kg/Viên:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.weightPerUnit + " Kg / Viên"}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Bề mặt:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSurface}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Chất liệu:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productMaterial}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Kích thước:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSize}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Xuất xứ:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productOrigin}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Màu sắc:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productColor}
                />
              </div>
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Số lượng vân:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={selectedProduct.patternQuantity}
                />
              </div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (selectedProduct) {
                      const jsonData = generateProductJSON(
                        selectedProduct,
                        technicalInfo,
                        storageName,
                        surfaceStore.productSurfaceList,
                        materialStore.productMaterialList,
                        colorStore.productColorList,
                        sizeStore.productSizeList,
                        patternStore.productPatternList // nếu có originId thì thay bằng originStore.productOriginList
                      );
                      navigator.clipboard.writeText(JSON.stringify(jsonData));
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Copy JSON
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Đang tải thông tin...</div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isSapoModalOpen}
        onClose={() => setIsSapoModalOpen(false)}
        className="w-full max-w-[1100px] px-20"
      >
        <div className="p-4 max-h-[80vh] overflow-y-scroll">
          <h2 className="text-2xl font-bold my-5 text-center text-black dark:text-white">
            THÔNG TIN MÃ DỰ ÁN GẠCH ỐP LÁT
          </h2>
          {selectedProduct ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Row 1: Tên phiên bản sản phẩm */}
                <div className="col-span-2">
                  <ProductLabel className="text-md font-bold mb-1">
                    Tên phiên bản sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.sapoName}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Mã sản phẩm của NCC | NSX:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.supplierItemCode}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Mô tả sản phẩm:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      productSizeSapo +
                      " ( " +
                      selectedProduct.quantityPerBox +
                      "Viên/" +
                      selectedProduct.areaPerBox +
                      "m2/thùng)"
                    }
                  />
                </div>
                {/* Row 2: Mã sản phẩm và Mã vạch */}
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Mã sản phẩm / SKU:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.confirmSupplierItemCode}
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Mã vạch / Barcode:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.autoBarCode}
                  />
                </div>

                {/* Row 3: Khối lượng và Đơn vị tính */}
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Khối lượng:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      convertKgPerM2(
                        selectedProduct.weightPerBox,
                        selectedProduct.areaPerBox
                      ) + " Kg / M2"
                    }
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Đơn vị tính:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full italic text-red-500"
                    value={
                      calculatedUnitStore.productCalculatedUnitList.find(
                        (x) => x.id === selectedProduct?.calculatedUnitId
                      )?.calculatedUnitName ?? "Chưa xác định"
                    }
                  />
                </div>

                {/* Row 4: Nhãn hiệu và Tag */}
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Nhãn hiệu:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      supplier
                        ? `${supplier.supplierName ?? ""}-${
                            supplier.supplierCombinedCode ?? ""
                          }`
                        : "Chưa xác định"
                    }
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Tag:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      supplier
                        ? `${supplier.supplierCodeName ?? ""}-${
                            supplier.supplierCombinedCode ?? ""
                          }`
                        : "Chưa xác định"
                    }
                  />
                </div>

                {/* Row 5: Giá bán lẻ vnd/m2 và Mô tả sản phẩm */}
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá bán lẻ (VND/m2):
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      selectedProduct.retailPrice
                        ? `${selectedProduct.retailPrice.toLocaleString()} VND/m2`
                        : "Chưa có giá"
                    }
                  />
                </div>
                <div>
                  <ProductLabel className="text-md font-bold mb-1">
                    Giá mua:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      selectedProduct.confirmListPrice
                        ? `${selectedProduct.confirmListPrice.toLocaleString()} VND/m2`
                        : "Chưa có giá"
                    }
                  />
                </div>
              </div>

              <div>
                <ProductLabel className="text-md font-bold mb-1 text-red-500">
                  Ngày nhập liệu:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full font-bold dark:text-white "
                  value={new Date(Date.now()).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  disabled
                />
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* Quantity and Weight Information */}
                <div className="col-span-6">
                  <ProductLabel className="text-md font-bold mb-1">
                    Hệ vân & nhóm chủng loại:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={
                      patternStore.productPatternList.find(
                        (x) => x.id === selectedProduct?.brickPatternId
                      )?.name ?? "Chưa xác định"
                    }
                  />
                </div>
                <div className="col-span-6">
                  <ProductLabel className="text-md font-bold mb-1">
                    Số lượng vân:
                  </ProductLabel>
                  <ProductInputField
                    className="h-8 text-md w-full"
                    value={selectedProduct.patternQuantity}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div>
                <ProductLabel className="text-md font-bold mb-1">
                  Kích thước danh nghĩa:
                </ProductLabel>
                <ProductInputField
                  className="h-8 text-md w-full"
                  value={productSize}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Đang tải thông tin...</div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        className="w-full max-w-[450px]"
      >
        <div className="p-10 mt-10 flex flex-col items-center">
          {/* Khối chứa thông tin sẽ được chụp lại bằng html2canvas */}
          <div
            ref={qrCardRef}
            className="flex gap-6 items-center my-2 p-4 bg-white border-1 border-gray-400 w-[420px]"
          >
            <QRCodeCanvas
              value={`https://tct-data-management-fe.vercel.app/products/detail/${selectedQrProduct?.id}`}
              size={150}
              level={"Q"}
            />
            <div className="text-start flex flex-col gap-3">
              <h3 className="font-bold text-xl text-black">
                {selectedQrProduct?.confirmAutoBarCode}
              </h3>
              <p className="text-gray-800 font-medium text-lg">
                {selectedQrProduct && (selectedQrProduct as any).actualSize
                  ? `${Number(((selectedQrProduct as any).actualSize).wide) / 10} x ${Number(((selectedQrProduct as any).actualSize).length) / 10} cm`
                  : "Chưa xác định"}
              </p>
              <p className="text-gray-800 font-medium text-lg">
                {selectedQrProduct?.originCountry?.name || "Chưa xác định"}
              </p>
              <p className="font-bold text-lg text-black mt-1">
                {selectedQrProduct?.retailPrice?.toLocaleString() || "0"} vnđ / {selectedQrProduct?.calculatedUnit?.calculatedUnitName?.toLowerCase() || "chưa xác định"}
              </p>
            </div>
          </div>

          {/* Nút tải PNG (nằm ngoài phạm vi chụp ảnh) */}
          <button
            onClick={handleDownloadPng}
            className="mt-6 w-[300px] py-2.5 bg-white border-2 border-gray-400 rounded-lg text-black font-semibold hover:bg-gray-100 transition-colors"
          >
            Tải PNG
          </button>
        </div>
      </Modal>
    </>
  );
};

export default observer(ProductTableComponent);
