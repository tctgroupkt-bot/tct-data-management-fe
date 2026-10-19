import ComponentCard from '../../../common/ComponentCard.tsx'
import ProductLabel from '../ProductLabel.tsx'
import Input from '../input/product/ProductInputField.tsx'
import { useStore } from '../../../../app/stores/store.ts'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ReactSelect from 'react-select'
import { ProductDetail } from '../../../../app/models/product/product.model.ts' // Đây nè!
import { useTheme } from '../../../../app/context/ThemeContext.tsx'

interface Option {
  value: number;
  label: string;
}

interface ProductProps {
  product?: ProductDetail;
  isCreateMode: boolean;
  onChange?: (field: string, value: any) => void;
}

const SupplierGroup = ({product, isCreateMode, onChange}: ProductProps) => {
  const { supplierStore, productStore, patternStore } = useStore()
  const { productSupplierList } = supplierStore
  const { getNextOrderNumberAuto } = productStore
  const { productPatternList } = patternStore
  const [autoSupplierCode, setAutoSupplierCode] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<Option | null>(null)
  const { theme } = useTheme();
  useEffect(() => {
    if (!isCreateMode && product?.supplierId) {
      // Cập nhật qua action của store để không vi phạm MobX strict-mode
      productStore.updateProductForm("supplierId", product.supplierId as any);
    }
  }, [isCreateMode, product]);


  // Mapping list
  const supplierOptions: Option[] = productSupplierList.map(supplier => ({
    value: supplier.id,
    label: supplier.supplierCodeName
  }))

  useEffect(() => {
    if (!product?.supplierId || supplierOptions.length === 0) return;

    const selected = supplierOptions.find(option => option.value === product.supplierId) || null;

    // Chỉ set lại nếu khác với current state
    if (selected?.value !== selectedSupplier?.value) {
      setSelectedSupplier(selected);
      // Khi edit, sử dụng supplierCode từ product hoặc supplierShortCode từ selected supplier
      const supplier = productSupplierList.find(x => x.id === product.supplierId);
      setAutoSupplierCode(product?.supplierCode || supplier?.supplierShortCode || '');
    }
  }, [product?.supplierId, product?.supplierCode, supplierOptions.length]);


  return (
    <ComponentCard title="Nhà cung cấp">
      <div className="space-y-6">
        <div>
          <ProductLabel>Tên nhà cung cấp</ProductLabel>
          <div className="relative">
            <ReactSelect
              options={supplierOptions}
              value={selectedSupplier}
              noOptionsMessage={() => "Không có nhà cung cấp"}
              onChange={async (selectedOption) => {
                if (!selectedOption) {
                  // Reset supplierId trong store trước (giống create mode)
                  productStore.updateProductForm("supplierId", null);
                  setSelectedSupplier(null);
                  setAutoSupplierCode('');
                  
                  // Sau đó cập nhật các giá trị khác nếu là edit mode
                  if (onChange) {
                    onChange("supplierId", product?.supplierId);
                    onChange("supplierCodeName", "");
                                      // Reset các giá trị liên quan khi xóa supplier
                  onChange("productOrderNumber", null);
                  onChange("productCode", "");
                  onChange("confirmProductCode", "");
                  onChange("autoBarCode", "");
                  onChange("confirmAutoBarCode", "");
                  }
                  return;
                }
                // Cập nhật supplierId vào store trước (giống create mode)
                productStore.updateProductForm("supplierId", selectedOption.value);
                setSelectedSupplier(selectedOption);
                const supplier = productSupplierList.find(x => x.id === selectedOption.value);
                const supplierCode = supplier?.supplierCodeName || '';
                setAutoSupplierCode(supplierCode);
                
                // Gọi getNextOrderNumberAuto để lấy order number mới (giống create mode)
                await getNextOrderNumberAuto();
                
                // Sau đó cập nhật các giá trị khác nếu là edit mode
                if (onChange) {
                  onChange("supplierId", selectedOption.value);
                  onChange("supplierCodeName", supplierCode);
                  
                  // Cập nhật productOrderNumber và confirmProductCode với order number mới
                  const newOrderNumber = productStore.productForm.productOrderNumber;
                  if (newOrderNumber) {
                    const newProductCode = `${supplier?.supplierShortCode || ''}.${newOrderNumber}`;
                    // Lấy pattern code từ pattern list thay vì dùng brickPatternShortName
                    const pattern = productPatternList.find((x: any) => x.id === product?.brickPatternId);
                    const patternCode = pattern?.shortCode || '';
                    const newAutoBarCode = `${supplier?.supplierShortCode || ''}.${newOrderNumber}${patternCode}`;
                    onChange("productOrderNumber", newOrderNumber);
                    onChange("productCode", newProductCode);
                    onChange("confirmProductCode", newProductCode);
                    onChange("autoBarCode", newAutoBarCode);
                    onChange("confirmAutoBarCode", newAutoBarCode);
                  }
                }
              }}
              placeholder="Chọn nhà cung cấp..."
              isClearable={true}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "44px",
                  height: "44px",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "14px",
                  backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                  color: theme === 'dark' ? '#fff' : base.color,
                  borderColor: theme === 'dark' ? '#384052' : base.borderColor,
                  border: theme === 'dark' ? '1px solid #384052' : '1px solid #e5e7eb',
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: "44px",
                  padding: "0 8px",
                  backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                  color: theme === 'dark' ? '#fff' : base.color,
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: "44px",
                  backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                }),
                option: (base, state) => ({
                  ...base,
                  fontFamily: "Roboto, sans-serif",
                  backgroundColor: state.isFocused
                    ? (theme === 'dark' ? '#23232b' : '#f3f4f6')
                    : (theme === 'dark' ? '#131827' : 'white'),
                  color: theme === 'dark' ? '#fff' : 'black',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: theme === 'dark' ? '#131827' : base.backgroundColor,
                  color: theme === 'dark' ? '#fff' : base.color,
                }),
                singleValue: (base) => ({
                  ...base,
                  color: theme === 'dark' ? '#fff' : base.color,
                }),
                input: (base) => ({
                  ...base,
                  color: theme === 'dark' ? '#fff' : base.color,
                }),
              }}
            />
          </div>
        </div>
        <div>
          <ProductLabel>Mã nhà cung cấp</ProductLabel>
          <div className="relative">
            <Input
              placeholder="Tự động điền"
              disabled
              value={isCreateMode ? autoSupplierCode : product?.supplierCode || ''}
            />
          </div>
        </div>
      </div>
    </ComponentCard>
  )
}

export default observer(SupplierGroup)
