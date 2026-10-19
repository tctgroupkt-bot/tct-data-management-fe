import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store.ts";
import Button from "../../components/ui/button/Button.tsx";
import QuillEditor from "../../components/common/editor/QuillEditor.tsx";
import { convertPolicyStatusToVietnamese } from "../../app/common/common.ts";

const CaseStudyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const caseStudyId = Number(id);
  const { caseStudyStore, userStore } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = userStore.user?.role?.includes("Admin") ?? false;

  useEffect(() => {
    if (caseStudyId) {
      caseStudyStore.loadCaseStudyById(caseStudyId);
    }
  }, [caseStudyId, caseStudyStore]);

  const detail = caseStudyStore.selectedCaseStudy;

  useEffect(() => {
    if (detail && !isEditing) {
      caseStudyStore.caseStudyUpdateForm = {
        title: detail.title,
        content: detail.content,
        caseType: detail.caseType,
        status: detail.status,
      };
    }
  }, [detail, isEditing, caseStudyStore]);

  const handleSave = async () => {
    if (!detail) return;
    const success = await caseStudyStore.updateCaseStudy(
      detail.id,
      caseStudyStore.caseStudyUpdateForm
    );
    if (success) {
      setIsEditing(false);
    }
  };

  if (!detail && caseStudyStore.loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Chi tiết nghiên cứu tình huống</h1>
        <p className="text-gray-700">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Chi tiết nghiên cứu tình huống</h1>
        <p className="text-gray-700">Không tìm thấy dữ liệu case study.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết nghiên cứu tình huống</h1>
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-900 space-y-4">
        {!isEditing || !isAdmin ? (
          <>
            <h2 className="text-xl font-semibold">{detail.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-semibold">Loại:</span> {detail.caseType}
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span> {convertPolicyStatusToVietnamese(detail.status)}
              </div>
              <div>
                <span className="font-semibold">Tác giả:</span> {detail.authorName}
              </div>
            </div>

            <div className="text-sm">
              <span className="font-semibold">Lượt thích:</span> {detail.likeCount}
              <span className="mx-2">•</span>
              <span className="font-semibold">Xác thực:</span>{" "}
              {detail.isAdminVerified ? "Đã xác thực" : "Chưa xác thực"}
            </div>

            <div
              className="text-gray-700 dark:text-gray-200 ql-editor"
              dangerouslySetInnerHTML={{ __html: detail.content }}
            />

            <div className="flex flex-wrap gap-3 pt-2">
              {isAdmin && (
                <Button
                  type="button"
                  className="bg-[#334355] text-white hover:bg-[#334355]/80"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              )}

              <Button
                type="button"
                className="bg-pink-600 text-white hover:bg-pink-700"
                onClick={async () => {
                  await caseStudyStore.toggleLikeCaseStudy(caseStudyId);
                }}
              >
                {detail.isLikedByCurrentUser ? "Rút tim" : "Thả tim"}
              </Button>

              <Button
                type="button"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={async () => {
                  await caseStudyStore.toggleVerifyCaseStudy(caseStudyId);
                }}
              >
                {detail.isAdminVerified ? "Bỏ xác thực" : "Xác thực bài viết"}
              </Button>

              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  const success = await caseStudyStore.deleteCaseStudy(caseStudyId);
                  if (success) navigate("/case-studies");
                }}
              >
                Xóa bài viết
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Tiêu đề</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                value={caseStudyStore.caseStudyUpdateForm.title}
                onChange={(e) =>
                  caseStudyStore.updateCaseStudyUpdateForm("title", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2">Loại</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={caseStudyStore.caseStudyUpdateForm.caseType}
                  onChange={(e) =>
                    caseStudyStore.updateCaseStudyUpdateForm(
                      "caseType",
                      e.target.value as "COMMON" | "SPECIFIC"
                    )
                  }
                >
                  <option value="SPECIFIC">SPECIFIC</option>
                  <option value="COMMON">COMMON</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={caseStudyStore.caseStudyUpdateForm.status}
                  onChange={(e) =>
                    caseStudyStore.updateCaseStudyUpdateForm(
                      "status",
                      e.target.value as "PUBLISHED" | "DRAFT"
                    )
                  }
                >
                  <option value="PUBLISHED">{convertPolicyStatusToVietnamese("PUBLISHED")}</option>
                  <option value="DRAFT">{convertPolicyStatusToVietnamese("DRAFT")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Nội dung</label>
              <QuillEditor
                value={caseStudyStore.caseStudyUpdateForm.content}
                onChange={(value) =>
                  caseStudyStore.updateCaseStudyUpdateForm("content", value)
                }
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 text-white hover:bg-gray-600"
                onClick={() => {
                  setIsEditing(false);
                  caseStudyStore.caseStudyUpdateForm = {
                    title: detail.title,
                    content: detail.content,
                    caseType: detail.caseType,
                    status: detail.status,
                  };
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                className="bg-[#334355] text-white hover:bg-[#334355]/80"
                disabled={caseStudyStore.loading}
                onClick={handleSave}
              >
                {caseStudyStore.loading ? "Đang xử lý..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(CaseStudyDetail);