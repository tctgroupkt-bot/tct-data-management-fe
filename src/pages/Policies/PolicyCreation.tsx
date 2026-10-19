import { FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store.ts";
import Button from "../../components/ui/button/Button.tsx";
import QuillEditor from "../../components/common/editor/QuillEditor.tsx";
import { convertPolicyStatusToVietnamese } from "../../app/common/common.ts";

const PolicyCreation = () => {
    const navigate = useNavigate();
    const { policyStore, policyCategoryStore } = useStore();

    useEffect(() => {
        policyCategoryStore.loadPolicyCategories();
    }, [policyCategoryStore]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await policyStore.createPolicy();
        if (success) navigate("/policy-review");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tạo chính sách mới</h1>
            <p className="text-gray-700 mb-6">
                Định nghĩa chính sách mới và gán danh mục để người dùng học tập.
            </p>

            <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold mb-4">Form tạo chính sách mới</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="policyName">
                            Tên chính sách
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded-lg"
                            type="text"
                            id="policyName"
                            value={policyStore.policyForm.title}
                            onChange={(e) => policyStore.updatePolicyForm("title", e.target.value)}
                            placeholder="Nhập tên chính sách"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="policyCategory">
                            Danh mục chính sách
                        </label>
                        <select
                            id="policyCategory"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={policyStore.policyForm.categoryId || ""}
                            onChange={(e) =>
                                policyStore.updatePolicyForm("categoryId", Number(e.target.value))
                            }
                            required
                        >
                            <option value="" disabled>
                                Chọn danh mục
                            </option>
                            {policyCategoryStore.policyCategoryList.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="policyStatus">
                            Trạng thái
                        </label>
                        <select
                            id="policyStatus"
                            className="w-full px-3 py-2 border rounded-lg"
                            value={policyStore.policyForm.status}
                            onChange={(e) =>
                                policyStore.updatePolicyForm("status", e.target.value as "DRAFT" | "PUBLISHED")
                            }
                            required
                        >
                            <option value="PUBLISHED">{convertPolicyStatusToVietnamese("PUBLISHED")}</option>
                            <option value="DRAFT">{convertPolicyStatusToVietnamese("DRAFT")}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="policyContent">
                            Nội dung chính sách
                        </label>
                        <QuillEditor
                            value={policyStore.policyForm.content}
                            onChange={(value) => policyStore.updatePolicyForm("content", value)}
                            placeholder="Nhập nội dung chính sách"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            className="bg-gray-500 text-white hover:bg-gray-600"
                            onClick={() => navigate("/policy-review")}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#334355] text-white hover:bg-[#334355]/80"
                            disabled={policyStore.loading}
                        >
                            {policyStore.loading ? "Đang xử lý..." : "Tạo chính sách"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default observer(PolicyCreation);