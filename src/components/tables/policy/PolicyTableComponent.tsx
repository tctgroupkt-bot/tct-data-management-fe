import { useNavigate } from "react-router-dom";
import DataTable, { TableColumn } from "react-data-table-component";
import { observer } from "mobx-react-lite";
import { FaEye } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { PolicyDto } from "../../../app/models/policy/policy.model.ts";
import { convertPolicyStatusToVietnamese } from "../../../app/common/common.ts";

interface PolicyTableComponentProps {
  data: PolicyDto[];
  loading: boolean;
}

const PolicyTableComponent = ({ data, loading }: PolicyTableComponentProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const columns: TableColumn<PolicyDto>[] = [
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
      name: "Danh mục",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Tác giả",
      selector: (row) => row.authorName,
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => convertPolicyStatusToVietnamese(row.status),
      sortable: true,
      maxWidth: "140px",
    },
    {
      name: "Cập nhật",
      selector: (row) => new Date(row.updatedAt).toLocaleDateString("vi-VN"),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Hành động",
      cell: (row) => (
        <button
          onClick={() => navigate(`/policy/detail/${row.id}`)}
          data-tooltip-id="policy-view-tooltip"
          data-tooltip-content="Xem chi tiết"
        >
          <FaEye className="w-5 h-5 text-blue-600 hover:opacity-60" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      maxWidth: "100px",
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

      <Tooltip id="policy-view-tooltip" className="text-md" />
    </div>
  );
};

export default observer(PolicyTableComponent);