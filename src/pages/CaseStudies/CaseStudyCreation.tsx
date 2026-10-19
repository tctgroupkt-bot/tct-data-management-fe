import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store.ts";
import Button from "../../components/ui/button/Button.tsx";
import QuillEditor from "../../components/common/editor/QuillEditor.tsx";
import { convertPolicyStatusToVietnamese } from "../../app/common/common.ts";

const CaseStudyCreation = () => {
    const navigate = useNavigate();
    const { caseStudyStore } = useStore();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await caseStudyStore.createCaseStudy();
        if (success) navigate("/case-studies");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tạo case study mới</h1>
            <p className="text-gray-700 mb-6">
                Đây là nơi bạn có thể tạo ra một case study mới cho công ty.
            </p>
            <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold mb-4">Form tạo case study mới</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="caseStudyTitle">
                            Tiêu đề case study
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded-lg"
                            type="text"
                            id="caseStudyTitle"
                            value={caseStudyStore.caseStudyForm.title}
                            onChange={(e) => caseStudyStore.updateCaseStudyForm("title", e.target.value)}
                            placeholder="Nhập tiêu đề case study"
                            maxLength={500}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="caseStudyContent">
                            Nội dung case study
                        </label>
                        <QuillEditor
                            value={caseStudyStore.caseStudyForm.content}
                            onChange={(value) => caseStudyStore.updateCaseStudyForm("content", value)}
                            placeholder="Nhập nội dung case study"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="caseStudyType">
                                Loại case study
                            </label>
                            <select
                                id="caseStudyType"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={caseStudyStore.caseStudyForm.caseType}
                                onChange={(e) =>
                                    caseStudyStore.updateCaseStudyForm("caseType", e.target.value as "COMMON" | "SPECIFIC")
                                }
                                required
                            >
                                <option value="COMMON">Chung</option>
                                <option value="SPECIFIC">Đặc biệt</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="caseStudyStatus">
                                Trạng thái
                            </label>
                            <select
                                id="caseStudyStatus"
                                className="w-full px-3 py-2 border rounded-lg"
                                value={caseStudyStore.caseStudyForm.status || "PUBLISHED"}
                                onChange={(e) =>
                                    caseStudyStore.updateCaseStudyForm("status", e.target.value as "PUBLISHED" | "DRAFT")
                                }
                            >
                                <option value="PUBLISHED">{convertPolicyStatusToVietnamese("PUBLISHED")}</option>
                                <option value="DRAFT">{convertPolicyStatusToVietnamese("DRAFT")}</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            className="bg-gray-500 text-white hover:bg-gray-600"
                            onClick={() => navigate("/case-studies")}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#334355] text-white hover:bg-[#334355]/80"
                            disabled={caseStudyStore.loading}
                        >
                            {caseStudyStore.loading ? "Đang xử lý..." : "Tạo case study"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default observer(CaseStudyCreation);