import { FormEvent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store.ts";
import Button from "../../components/ui/button/Button.tsx";
import PolicyCategoryTableComponent from "../../components/tables/policy-category/PolicyCategoryTableComponent.tsx";

const PolicyCategoryCreation = () => {
    const { policyCategoryStore } = useStore();

    useEffect(() => {
        policyCategoryStore.searchPolicyCategories();
    }, [policyCategoryStore]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await policyCategoryStore.createPolicyCategory();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tạo danh mục chính sách mới</h1>
            <p className="text-gray-700 mb-6">
                Tạo mới và quản lý danh mục để tổ chức chính sách rõ ràng hơn.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900">
                    <h2 className="text-xl font-semibold mb-4">Form tạo danh mục</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="categoryName">
                                Tên danh mục chính sách
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                type="text"
                                id="categoryName"
                                value={policyCategoryStore.policyCategoryForm.name}
                                onChange={(e) => policyCategoryStore.updatePolicyCategoryForm("name", e.target.value)}
                                placeholder="Nhập tên danh mục chính sách"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="categoryDescription">
                                Mô tả danh mục chính sách
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg"
                                id="categoryDescription"
                                rows={5}
                                value={policyCategoryStore.policyCategoryForm.description || ""}
                                onChange={(e) =>
                                    policyCategoryStore.updatePolicyCategoryForm("description", e.target.value)
                                }
                                placeholder="Nhập mô tả cho danh mục chính sách"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-[#334355] text-white hover:bg-[#334355]/80"
                                disabled={policyCategoryStore.loading}
                            >
                                {policyCategoryStore.loading ? "Đang xử lý..." : "Tạo danh mục chính sách"}
                            </Button>
            </div>
                    </form>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900">
                    <h2 className="text-xl font-semibold mb-4">Danh mục hiện có</h2>
                    <PolicyCategoryTableComponent
                        data={policyCategoryStore.policyCategoryList}
                        loading={policyCategoryStore.loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(PolicyCategoryCreation);