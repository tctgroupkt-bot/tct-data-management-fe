import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import { observer } from "mobx-react-lite";
import { FaEye, FaHeart } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { Tooltip } from "react-tooltip";
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { CaseStudyDto } from "../../../app/models/caseStudy/caseStudy.model.ts";
import { useStore } from "../../../app/stores/store.ts";

interface CaseStudyTableComponentProps {
  data: CaseStudyDto[];
  loading: boolean;
}

const CaseStudyTableComponent = ({
  data,
  loading,
}: CaseStudyTableComponentProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { caseStudyStore } = useStore();

  const handleDelete = async (row: CaseStudyDto) => {
    await caseStudyStore.deleteCaseStudy(row.id);
  };

  const handleLike = async (row: CaseStudyDto) => {
    await caseStudyStore.toggleLikeCaseStudy(row.id);
  };

  const handleVerify = async (row: CaseStudyDto) => {
    await caseStudyStore.toggleVerifyCaseStudy(row.id);
  };

  const columns: TableColumn<CaseStudyDto>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "80px",
    },
    {
      name: "Tiêu đề",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "Loại",
      selector: (row) => row.caseType,
      sortable: true,
      maxWidth: "120px",
    },
    {
      name: "Tác giả",
      selector: (row) => row.authorName,
      sortable: true,
    },
    {
      name: "Lượt thích",
      selector: (row) => row.likeCount,
      sortable: true,
      maxWidth: "120px",
    },
    {
      name: "Xác thực",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.isAdminVerified
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.isAdminVerified ? "Đã xác thực" : "Chưa xác thực"}
        </span>
      ),
      maxWidth: "150px",
    },
    {
      name: "Hành động",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/case-study/detail/${row.id}`)}
            data-tooltip-id="case-study-view-tooltip"
            data-tooltip-content="Xem chi tiết"
          >
            <FaEye className="w-5 h-5 text-blue-600 hover:opacity-60" />
          </button>
          <button
            onClick={() => handleLike(row)}
            data-tooltip-id="case-study-like-tooltip"
            data-tooltip-content="Thả tim / Rút tim"
          >
            <FaHeart className="w-5 h-5 text-pink-600 hover:opacity-60" />
          </button>
          <button
            onClick={() => handleVerify(row)}
            data-tooltip-id="case-study-verify-tooltip"
            data-tooltip-content="Bật/Tắt xác thực"
            className="text-xs font-semibold text-emerald-700 hover:opacity-60"
          >
            ✔
          </button>
          <button
            onClick={() => handleDelete(row)}
            data-tooltip-id="case-study-delete-tooltip"
            data-tooltip-content="Xóa"
          >
            <CiTrash className="w-5 h-5 text-red-600 hover:opacity-60" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: "170px",
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <DataTable
        theme={theme === "dark" ? "customDark" : "default"}
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        striped
        progressPending={loading}
        progressComponent={
          <div className="py-8 text-center font-semibold font-roboto w-full">
            Đang chờ...
          </div>
        }
        noDataComponent={
          <div className="py-8 text-center font-semibold font-roboto w-full">
            Không có dữ liệu để hiển thị.
          </div>
        }
      />

      <Tooltip id="case-study-view-tooltip" className="text-md" />
      <Tooltip id="case-study-like-tooltip" className="text-md" />
      <Tooltip id="case-study-verify-tooltip" className="text-md" />
      <Tooltip id="case-study-delete-tooltip" className="text-md" />
    </div>
  );
};

export default observer(CaseStudyTableComponent);