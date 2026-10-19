import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store.ts";
import Button from "../../components/ui/button/Button.tsx";
import QuillEditor from "../../components/common/editor/QuillEditor.tsx";
import { convertPolicyStatusToVietnamese } from "../../app/common/common.ts";

const PolicyDetail = () => {
    const { id } = useParams();
    const policyId = Number(id);
    const { policyStore, policyCategoryStore, userStore } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const isAdmin = userStore.user?.role?.includes("Admin") ?? false;

    useEffect(() => {
        if (policyId) {
            policyStore.loadPolicyById(policyId);
            policyCategoryStore.loadPolicyCategories();
        }
    }, [policyId, policyStore, policyCategoryStore]);

    const detail = policyStore.selectedPolicy;

    useEffect(() => {
        if (detail && !isEditing) {
            policyStore.policyUpdateForm = {
                id: detail.id,
                title: detail.title,
                content: detail.content,
                categoryId: detail.categoryId,
                status: detail.status,
            };
    }
    }, [detail, isEditing, policyStore]);

    const handleSave = async () => {
        if (!detail) return;
        const success = await policyStore.updatePolicy(detail.id, policyStore.policyUpdateForm);
        if (success) {
            setIsEditing(false);
        }
    };

    if (!detail && policyStore.loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Chi tiết chính sách</h1>
                <p className="text-gray-700">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!detail) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Chi tiết chính sách</h1>
                <p className="text-gray-700">Không tìm thấy chính sách.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Chi tiết chính sách</h1>
            <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900">
                {!isEditing || !isAdmin ? (
                    <>
                        <h2 className="text-xl font-semibold mb-2">{detail.title}</h2>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <span className="font-semibold">Danh mục:</span> {detail.categoryName}
                            <span className="mx-2">•</span>
                            <span className="font-semibold">Tác giả:</span> {detail.authorName}
                            <span className="mx-2">•</span>
                            <span className="font-semibold">Trạng thái:</span> {convertPolicyStatusToVietnamese(detail.status)}
            </div>
                        <div
                            className="text-gray-700 dark:text-gray-200 ql-editor"
                            dangerouslySetInnerHTML={{ __html: detail.content }}
                        />
                        {isAdmin && (
                            <div className="flex justify-end mt-4">
                                <Button
                                    type="button"
                                    className="bg-[#334355] text-white hover:bg-[#334355]/80"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Chỉnh sửa
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 mb-2">Tiêu đề</label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                value={policyStore.policyUpdateForm.title}
                                onChange={(e) => policyStore.updatePolicyUpdateForm("title", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 mb-2">Danh mục</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={policyStore.policyUpdateForm.categoryId || ""}
                                    onChange={(e) =>
                                        policyStore.updatePolicyUpdateForm("categoryId", Number(e.target.value))
                                    }
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
                                <label className="block text-gray-700 dark:text-gray-200 mb-2">Trạng thái</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={policyStore.policyUpdateForm.status}
                                    onChange={(e) => policyStore.updatePolicyUpdateForm("status", e.target.value)}
                                >
                                    <option value="PUBLISHED">{convertPolicyStatusToVietnamese("PUBLISHED")}</option>
                                    <option value="DRAFT">{convertPolicyStatusToVietnamese("DRAFT")}</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 mb-2">Nội dung</label>
                            <QuillEditor
                                value={policyStore.policyUpdateForm.content}
                                onChange={(value) => policyStore.updatePolicyUpdateForm("content", value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                className="bg-gray-500 text-white hover:bg-gray-600"
                                onClick={() => {
                                    setIsEditing(false);
                                    policyStore.policyUpdateForm = {
                                        id: detail.id,
                                        title: detail.title,
                                        content: detail.content,
                                        categoryId: detail.categoryId,
                                        status: detail.status,
                                    };
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                className="bg-[#334355] text-white hover:bg-[#334355]/80"
                                disabled={policyStore.loading}
                                onClick={handleSave}
                            >
                                {policyStore.loading ? "Đang xử lý..." : "Lưu thay đổi"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(PolicyDetail);