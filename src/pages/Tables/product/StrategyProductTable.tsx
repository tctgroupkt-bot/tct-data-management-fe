import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import StrategyProductTableComponent from "../../../components/tables/product/StrategyProductTableComponent.tsx";
import { useStore } from "../../../app/stores/store.ts";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import TableComponentCard from "../../../components/common/product/TableComponentCard.tsx";
import Modal from "../../../components/ui/modal/index.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import ProductLabel from "../../../components/form/product-form/ProductLabel";
import ProductInputField from "../../../components/form/product-form/input/product/ProductInputField";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { useApi } from "../../../hooks/useApi";
import { UploadWebsiteStatus } from "../../../app/models/product/enum/product.enum.ts";

const StrategyProductTable = () => {
  const { productStore, supplierTaxStore, supplierStore, sizeStore } =
    useStore();
  const [pageSize, setPageSize] = useState(productStore.pageSize || 10);
  const {
    strategyProductList,
    loadStrategyProducts,
    loading,
    totalCount,
    existingSupplierSizeCombinations,
  } = productStore;
  const { isOnline } = useApi();
  const { productSupplierList } = supplierStore;
  const { productSizeList } = sizeStore;
  const { productSupplierTaxList } = supplierTaxStore;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pageNumber, setLocalPageNumber] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<
    UploadWebsiteStatus[]
  >([]);
  const [tempSelectedSupplier, setTempSelectedSupplier] = useState<
    number | null
  >(null);
  const [tempSelectedSize, setTempSelectedSize] = useState<number | null>(null);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<
    UploadWebsiteStatus[]
  >([]);
  const [isAdvancedActive, setIsAdvancedActive] = useState(false);
  const [selectedIsPriced, setSelectedIsPriced] = useState<boolean | null>(null);
  const [tempSelectedIsPriced, setTempSelectedIsPriced] = useState<boolean | null>(null);

  // Add debouncing for pageSize changes to prevent UI freezing with large page sizes
  const [debouncedPageSize, setDebouncedPageSize] = useState(pageSize);
  const [isPageSizeChanging, setIsPageSizeChanging] = useState(false);
  const pageSizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce pageSize changes to prevent UI freezing
  useEffect(() => {
    if (pageSizeTimeoutRef.current) {
      clearTimeout(pageSizeTimeoutRef.current);
    }

    // Show loading state immediately when pageSize changes
    setIsPageSizeChanging(true);

    // For large page sizes, add longer delay to prevent UI freezing
    const delay = pageSize >= 200 ? 1000 : 300;
    
    pageSizeTimeoutRef.current = setTimeout(() => {
      setDebouncedPageSize(pageSize);
      setIsPageSizeChanging(false);
    }, delay);

    return () => {
      if (pageSizeTimeoutRef.current) {
        clearTimeout(pageSizeTimeoutRef.current);
      }
    };
  }, [pageSize]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      await productStore.updateBatchProduct(file);
      setIsImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    loadStrategyProducts(
      debouncedPageSize,
      pageNumber,
      selectedSupplier ?? undefined,
      selectedSize ?? undefined,
      selectedStatuses,
      searchTerm || undefined,
      selectedIsPriced ?? undefined
    );
  }, [debouncedPageSize, pageNumber, selectedSupplier, selectedSize, selectedStatuses, searchTerm, selectedIsPriced]);

  const handlePageChange = (page: number) => {
    setLocalPageNumber(page);
    localStorage.setItem("strategy.pageNumber", page.toString());
  };

  const handlePageSizeChange = (newPageSize: number, _page: number) => {
    // Prevent changing pageSize if it's the same
    if (newPageSize === pageSize) return;
    
    setPageSize(newPageSize);
    setLocalPageNumber(1); // Reset to first page
    localStorage.setItem("strategy.pageSize", newPageSize.toString());
    localStorage.setItem("strategy.pageNumber", "1");
  };

  // Initialize saved filters and pagination on mount (use strategy.* keys)
  useEffect(() => {
    const savedSupplier = localStorage.getItem("strategy.selectedSupplier");
    const savedSize = localStorage.getItem("strategy.selectedSize");
    const savedStatuses = localStorage.getItem("strategy.selectedStatuses");
    const savedIsPriced = localStorage.getItem("strategy.selectedIsPriced");
    const savedTerm = localStorage.getItem("strategy.term");
    const savedPageNumber = localStorage.getItem("strategy.pageNumber");
    const savedPageSize = localStorage.getItem("strategy.pageSize");
    const initialSupplierId = savedSupplier ? parseInt(savedSupplier) : null;
    const initialSizeId = savedSize ? parseInt(savedSize) : null;
    const initialStatuses: UploadWebsiteStatus[] = savedStatuses ? JSON.parse(savedStatuses) : [];
    const initialIsPriced: boolean | null = savedIsPriced ? JSON.parse(savedIsPriced) : null;

    setSelectedSupplier(initialSupplierId);
    setTempSelectedSupplier(initialSupplierId);
    setSelectedSize(initialSizeId);
    setTempSelectedSize(initialSizeId);
    setSelectedStatuses(initialStatuses);
    setTempSelectedStatuses(initialStatuses);
    setSelectedIsPriced(initialIsPriced);
    setTempSelectedIsPriced(initialIsPriced);
    if (savedTerm) {
      setSearchTerm(savedTerm);
      setSearchInput(savedTerm);
    }
    if (savedPageNumber) {
      const pn = parseInt(savedPageNumber);
      if (!Number.isNaN(pn) && pn > 0) setLocalPageNumber(pn);
    }
    if (savedPageSize) {
      const ps = parseInt(savedPageSize);
      if (!Number.isNaN(ps) && ps > 0) setPageSize(ps);
    }
    setIsAdvancedActive(
      initialSupplierId !== null ||
      initialSizeId !== null ||
      initialStatuses.length > 0 ||
      initialIsPriced !== null
    );
  }, []);

  const handleSearchInput = (term: string) => {
    setSearchInput(term);
  };
  const handleSearchSubmit = () => {
    setSearchTerm(searchInput);
    setLocalPageNumber(1);
    localStorage.setItem("strategy.term", searchInput);
    localStorage.setItem("strategy.pageNumber", "1");
  };

  const handleAdvancedOpen = () => {
    setTempSelectedSupplier(selectedSupplier);
    setTempSelectedSize(selectedSize);
    setTempSelectedStatuses(selectedStatuses);
    setTempSelectedIsPriced(selectedIsPriced);
    setIsAdvancedOpen(true);
  };
  const handleAdvancedClose = () => {
    setIsAdvancedOpen(false);
  };

  const handleResetFilters = () => {
    setIsAdvancedActive(false);
    setSelectedSupplier(null);
    setSelectedSize(null);
    setSelectedStatuses([]);
    setSelectedIsPriced(null);
    setTempSelectedSupplier(null);
    setTempSelectedSize(null);
    setTempSelectedStatuses([]);
    setTempSelectedIsPriced(null);
    setLocalPageNumber(1);
    setIsAdvancedOpen(false);
    
    // Clear localStorage
    localStorage.removeItem("strategy.selectedSupplier");
    localStorage.removeItem("strategy.selectedSize");
    localStorage.removeItem("strategy.selectedStatuses");
    localStorage.removeItem("strategy.selectedIsPriced");
    localStorage.setItem("strategy.pageNumber", "1");
  };

  const handleApplyFilters = () => {
    const hasChanges =
      selectedSupplier !== tempSelectedSupplier ||
      selectedSize !== tempSelectedSize ||
      JSON.stringify(selectedStatuses) !==
        JSON.stringify(tempSelectedStatuses) ||
      selectedIsPriced !== tempSelectedIsPriced ||
      !isAdvancedActive;

    if (!hasChanges) {
      setIsAdvancedOpen(false);
      return;
    }

    setSelectedSupplier(tempSelectedSupplier);
    setSelectedSize(tempSelectedSize);
    setSelectedStatuses(tempSelectedStatuses);
    setSelectedIsPriced(tempSelectedIsPriced);
    setIsAdvancedActive(
      tempSelectedSupplier !== null ||
        tempSelectedSize !== null ||
        tempSelectedStatuses.length > 0 ||
        tempSelectedIsPriced !== null
    );
    const newPageNumber = 1;
    setLocalPageNumber(newPageNumber);
    localStorage.setItem("strategy.pageNumber", newPageNumber.toString());
    if (tempSelectedSupplier !== null) {
      localStorage.setItem("strategy.selectedSupplier", tempSelectedSupplier.toString());
    } else {
      localStorage.removeItem("strategy.selectedSupplier");
    }
    if (tempSelectedSize !== null) {
      localStorage.setItem("strategy.selectedSize", tempSelectedSize.toString());
    } else {
      localStorage.removeItem("strategy.selectedSize");
    }
    localStorage.setItem(
      "strategy.selectedStatuses",
      JSON.stringify(tempSelectedStatuses)
    );
    if (tempSelectedIsPriced !== null) {
      localStorage.setItem(
        "strategy.selectedIsPriced",
        JSON.stringify(tempSelectedIsPriced)
      );
    } else {
      localStorage.removeItem("strategy.selectedIsPriced");
    }
    setIsAdvancedOpen(false);
  };

  // Hàm helper để kiểm tra nếu một cặp (supplierId, sizeId) tồn tại
  const combinationExists = (supId: number | null, szId: number | null) => {
    if (supId === null || szId === null) return false;
    return existingSupplierSizeCombinations.some(
      (combo) => combo.supplierId === supId && combo.sizeId === szId
    );
  };

  return (
    <>
      <PageMeta
        title="TCT Homemart Data Management"
        description="Đây là bảng tính giá sản phẩm của website TCT Homemart"
      />
      <PageBreadcrumb pageTitle="Bảng tính giá" />
      
      {/* Warning for large page sizes */}
      {pageSize >= 200 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Lưu ý:</strong> Bạn đang xem {pageSize} sản phẩm. Với số lượng lớn, trang có thể mất thời gian để tải và hiển thị.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading indicator for pageSize changes */}
      {isPageSizeChanging && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Đang chuẩn bị tải {pageSize} sản phẩm...
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <TableComponentCard
          title="Bảng tính giá"
          className="text-white"
          additionalButtons={
            <>
              <div className="hidden md:inline-flex">
                <Button
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white"
                  disabled={selectedIds.length === 0}
                  onClick={() => setIsBulkModalOpen(true)}
                >
                  Cập nhật giá
                </Button>
                <Button
                  className="ml-2 h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white md:mr-2"
                  onClick={handleImportClick}
                  disabled={isImporting}
                >
                  {isImporting ? "Đang xử lý..." : "Cập nhật sản phẩm"}
                </Button>
                <Button
                  className="h-8 py-5 font-semibold rounded bg-sky-700 hover:bg-sky-800 text-white md:mr-2"
                  onClick={handleAdvancedOpen}
                >
                  Nâng cao
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
              </div>
              {/* Mobile: chỉ hiện icon SVG, không dùng Button */}
              <div className="flex md:hidden gap-2">
                <div
                  onClick={
                    selectedIds.length === 0
                      ? undefined
                      : () => setIsBulkModalOpen(true)
                  }
                  className={`bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center${
                    selectedIds.length === 0
                      ? " opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{ width: 35, height: 35, cursor: "pointer" }}
                  aria-label="Cập nhật giá"
                >
                  {/* Upload SVG icon */}
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="35.000000pt"
                    height="35.000000pt"
                    viewBox="0 0 35.000000 35.000000"
                    className="h-6 w-6 text-white"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g
                      transform="translate(0.000000,35.000000) scale(0.100000,-0.100000)"
                      fill="#ffffff"
                      stroke="none"
                    >
                      <path
                        d="M125 325 c-22 -8 -52 -28 -67 -44 -31 -35 -55 -108 -39 -124 18 -18
                          41 1 41 34 0 22 10 41 34 65 29 29 41 34 79 34 57 0 99 -29 78 -54 -12 -14 -9
                          -16 33 -16 l46 0 0 47 c0 45 -1 46 -19 29 -13 -11 -21 -14 -26 -7 -22 36 -107
                          55 -160 36z"
                      />
                      <path
                        d="M297 193 c-4 -3 -7 -20 -7 -36 0 -20 -11 -40 -34 -63 -29 -29 -41
                          -34 -79 -34 -57 0 -99 29 -78 54 12 14 9 16 -33 16 l-46 0 0 -47 c0 -43 1 -45
                          18 -30 15 14 19 14 40 -4 61 -49 150 -43 208 15 32 32 61 107 49 126 -7 11
                          -28 13 -38 3z"
                      />
                    </g>
                  </svg>
                </div>
                <div
                  onClick={handleImportClick}
                  className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg flex items-center justify-center"
                  style={{ width: 35, height: 35, cursor: "pointer" }}
                  aria-label="Nhập file"
                >
                  {/* Upload SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
              </div>
            </>
          }
          isOnline={isOnline}
          onSearch={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
          searchTerm={searchInput}
        >
          <StrategyProductTableComponent
            data={strategyProductList}
            loading={loading || isPageSizeChanging}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            totalCount={totalCount}
            searchTerm={searchTerm}
            onPageSizeChange={handlePageSizeChange}
            pageSize={pageSize}
            onSelectedIdsChange={setSelectedIds}
          />
          <Modal
            isOpen={isBulkModalOpen}
            onClose={() => setIsBulkModalOpen(false)}
            className="
              w-full max-w-[800px] flex flex-col rounded-lg shadow-xl bg-white mx-auto
              h-[95vh] md:h-auto
              max-h-screen md:max-h-[90vh]
              my-2 sm:my-4 md:my-8
              overflow-y-auto md:overflow-hidden
            "
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedIds.length === 0) {
                  toast.error("Vui lòng chọn ít nhất một sản phẩm");
                  return;
                }
                try {
                  await productStore.bulkUpdateStrategyProducts({
                    ids: selectedIds,
                    editStrategyProductDto: {
                      ...productStore.bulkEditDto,
                      policyStandard:
                        productStore.bulkEditDto.policyStandard ?? 40,
                      firstPolicyStandardAfterDiscount:
                        productStore.bulkEditDto
                          .firstPolicyStandardAfterDiscount ?? 5,
                      secondPolicyStandardAfterDiscount:
                        productStore.bulkEditDto
                          .secondPolicyStandardAfterDiscount ?? 5,
                      taxRate: null,
                    },
                  });
                  setIsBulkModalOpen(false);
                  productStore.resetBulkEditDto();
                } catch (error) {
                  console.error("Error updating products:", error);
                  toast.error("Có lỗi xảy ra khi cập nhật sản phẩm");
                }
              }}
              className="flex flex-col flex-grow h-full min-h-0"
            >
              <div className="p-4 md:p-6 border-b flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
                  Cập nhật giá hàng loạt
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-4 md:py-3 px-6 flex-grow overflow-y-auto min-h-0">
                <div>
                  <ProductLabel htmlFor="quantityPerBox">
                    Số lượng/thùng
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="quantityPerBox"
                    name="quantityPerBox"
                    placeholder="Nhập số lượng/thùng"
                    value={productStore.bulkEditDto.quantityPerBox ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "quantityPerBox",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="listPrice">Giá niêm yết</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="listPrice"
                    name="listPrice"
                    placeholder="Nhập giá niêm yết"
                    value={productStore.bulkEditDto.listPrice ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "listPrice",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierRisingPrice">
                    Giá tăng NCC
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierRisingPrice"
                    name="supplierRisingPrice"
                    placeholder="Nhập giá tăng NCC"
                    value={productStore.bulkEditDto.supplierRisingPrice ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "supplierRisingPrice",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="otherPriceByCompany">
                    Giá khác (Cty)
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="otherPriceByCompany"
                    name="otherPriceByCompany"
                    placeholder="Nhập giá khác (Cty)"
                    value={productStore.bulkEditDto.otherPriceByCompany ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "otherPriceByCompany",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="quantityPerBox">Số lượng</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="quantityPerBox"
                    name="quantityPerBox"
                    placeholder="Nhập số lượng"
                    value={productStore.bulkEditDto.quantityPerBox ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "quantityPerBox",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="shippingFee">
                    Phí vận chuyển
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="shippingFee"
                    name="shippingFee"
                    placeholder="Nhập phí vận chuyển"
                    value={productStore.bulkEditDto.shippingFee ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "shippingFee",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="taxId">Thuế</ProductLabel>
                  <ReactSelect<{ value: number; label: string }>
                    placeholder="Chọn thuế"
                    noOptionsMessage={() => "Không có kết quả"}
                    options={productSupplierTaxList.map((tax) => ({
                      value: tax.id,
                      label: tax.name,
                    }))}
                    value={
                      productSupplierTaxList.find(
                        (tax) => tax.id === productStore.bulkEditDto.taxId
                      )
                        ? {
                            value: productStore.bulkEditDto.taxId!,
                            label: productSupplierTaxList.find(
                              (tax) => tax.id === productStore.bulkEditDto.taxId
                            )!.name,
                          }
                        : null
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField("taxId", e?.value ?? null)
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "44px",
                        height: "44px",
                        fontFamily: "Roboto, sans-serif",
                        fontSize: "14px",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        height: "44px",
                        padding: "0 8px",
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        height: "44px",
                      }),
                      option: (base, state) => ({
                        ...base,
                        fontFamily: "Roboto, sans-serif",
                        backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                        color: "black",
                      }),
                    }}
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="weightPerUnit">
                    Khối lượng/viên
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="weightPerUnit"
                    name="weightPerUnit"
                    placeholder="Nhập khối lượng/viên"
                    value={productStore.bulkEditDto.weightPerUnit ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "weightPerUnit",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="discount">Chiết khấu</ProductLabel>
                  <ProductInputField
                    type="number"
                    id="discount"
                    name="discount"
                    placeholder="Nhập chiết khấu"
                    value={productStore.bulkEditDto.discount ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "discount",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierDiscountCash">
                    Chiết khấu tiền mặt NCC
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierDiscountCash"
                    name="supplierDiscountCash"
                    placeholder="Nhập chiết khấu tiền mặt NCC"
                    value={productStore.bulkEditDto.supplierDiscountCash ?? ""}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "supplierDiscountCash",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="supplierDiscountPercentage">
                    Chiết khấu % NCC
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="supplierDiscountPercentage"
                    name="supplierDiscountPercentage"
                    placeholder="Nhập chiết khấu % NCC"
                    value={
                      productStore.bulkEditDto.supplierDiscountPercentage ?? ""
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "supplierDiscountPercentage",
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="policyStandard">
                    Chính sách chuẩn
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="policyStandard"
                    name="policyStandard"
                    placeholder="Nhập chính sách chuẩn"
                    value={productStore.bulkEditDto.policyStandard ?? 40}
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "policyStandard",
                        e.target.value === "" ? 50 : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="firstPolicyStandardAfterDiscount">
                    Chính sách 1 sau CK
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="firstPolicyStandardAfterDiscount"
                    name="firstPolicyStandardAfterDiscount"
                    placeholder="Nhập chính sách 1 sau CK"
                    value={
                      productStore.bulkEditDto
                        .firstPolicyStandardAfterDiscount ?? 5
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "firstPolicyStandardAfterDiscount",
                        e.target.value === "" ? 5 : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div>
                  <ProductLabel htmlFor="secondPolicyStandardAfterDiscount">
                    Chính sách 2 sau CK
                  </ProductLabel>
                  <ProductInputField
                    type="number"
                    id="secondPolicyStandardAfterDiscount"
                    name="secondPolicyStandardAfterDiscount"
                    placeholder="Nhập chính sách 2 sau CK"
                    value={
                      productStore.bulkEditDto
                        .secondPolicyStandardAfterDiscount ?? 5
                    }
                    onChange={(e) =>
                      productStore.setBulkEditField(
                        "secondPolicyStandardAfterDiscount",
                        e.target.value === "" ? 5 : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="p-4 md:p-3 border-t flex-shrink-0">
                <Button
                  type="submit"
                  disabled={
                    selectedIds.length === 0 ||
                    Object.values(productStore.bulkEditDto).every(
                      (v) => v === null
                    )
                  }
                  className="w-full bg-blue-600 text-white"
                >
                  Cập nhật
                </Button>
              </div>
            </form>
          </Modal>
          <Modal
            isOpen={isAdvancedOpen}
            onClose={handleAdvancedClose}
            showCloseButton={false}
            className="p-8 w-full max-w-[800px]"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Supplier Column */}
              <div className="col-span-5">
                <h2 className="font-bold mb-2 text-sm text-black md:text-lg">
                  Chọn Nhà Cung Cấp
                </h2>
                {supplierStore.loading ? (
                  <p>Đang tải nhà cung cấp...</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                    {productSupplierList.map((supplier) => {
                      const disabled =
                        tempSelectedSize !== null &&
                        !combinationExists(supplier.id, tempSelectedSize);
                      return (
                        <button
                          key={supplier.id}
                          disabled={disabled}
                          className={`px-2 py-2 text-xs min-w-[250px] md:px-4 md:py-2 md:text-base md:min-w-[180px] rounded text-left whitespace-nowrap ${
                            disabled
                              ? "bg-gray-400 text-white"
                              : tempSelectedSupplier === supplier.id
                              ? "bg-blue-600 text-white"
                              : "bg-blue-400 text-white hover:bg-blue-500"
                          }`}
                          onClick={() => {
                            if (disabled) return;
                            setTempSelectedSupplier(
                              tempSelectedSupplier === supplier.id
                                ? null
                                : supplier.id
                            );
                          }}
                        >
                          {supplier.supplierCodeName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Size Column */}
              <div className="col-span-3">
                <h2 className="font-bold mb-2 text-sm text-black md:text-lg">
                  Chọn Kích Thước
                </h2>
                {sizeStore.loading ? (
                  <p>Đang tải kích thước...</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                    {productSizeList.map((size) => {
                      const disabled =
                        tempSelectedSupplier !== null &&
                        !combinationExists(tempSelectedSupplier, size.id);
                      return (
                        <button
                          key={size.id}
                          disabled={disabled}
                          className={`px-2 py-2 text-xs min-w-[90px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[90px] md:w-[111px] ${
                            disabled
                              ? "bg-gray-400 text-white"
                              : tempSelectedSize === size.id
                              ? "bg-green-600 text-white"
                              : "bg-green-400 text-white hover:bg-green-500"
                          }`}
                          onClick={() => {
                            if (disabled) return;
                            setTempSelectedSize(
                              tempSelectedSize === size.id ? null : size.id
                            );
                          }}
                        >
                          {size.wide}x{size.length}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* Price status row (under supplier & size) */}
            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-12">
                <h2 className="font-bold mb-2 text-sm md:text-lg text-black">
                  Chọn Trạng Thái Giá
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`flex items-center justify-center px-2 py-2 text-xs text-center min-w-[100px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[100px] md:w-[111px] ${
                      tempSelectedIsPriced === true
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-blue-400 text-white hover:bg-blue-500"
                    }`}
                    onClick={() => {
                      setTempSelectedIsPriced(
                        tempSelectedIsPriced === true ? null : true
                      );
                    }}
                  >
                    Đã có giá
                  </button>
                  <button
                    className={`flex items-center justify-center px-2 py-2 text-xs text-center min-w-[100px] md:px-4 md:py-2 md:text-base md:min-w-[111px] rounded whitespace-nowrap w-[100px] md:w-[111px] ${
                      tempSelectedIsPriced === false
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-blue-400 text-white hover:bg-blue-500"
                    }`}
                    onClick={() => {
                      setTempSelectedIsPriced(
                        tempSelectedIsPriced === false ? null : false
                      );
                    }}
                  >
                    Chưa có giá
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-start mt-4 gap-2">
              <Button
                onClick={handleApplyFilters}
                className="bg-blue-700 text-white px-4 py-2 rounded"
              >
                Áp dụng
              </Button>
              <Button
                onClick={handleResetFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </Modal>
        </TableComponentCard>
      </div>
    </>
  );
};

export default observer(StrategyProductTable);
