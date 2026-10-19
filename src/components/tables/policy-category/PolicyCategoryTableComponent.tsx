import DataTable, { TableColumn } from "react-data-table-component";
import { observer } from "mobx-react-lite";
import { CiTrash } from "react-icons/ci";
import { Tooltip } from "react-tooltip";
import { useTheme } from "../../../app/context/ThemeContext.tsx";
import { PolicyCategoryDto } from "../../../app/models/policy/policyCategory.model.ts";
import { useStore } from "../../../app/stores/store.ts";

interface PolicyCategoryTableComponentProps {
  data: PolicyCategoryDto[];
  loading: boolean;
}

const PolicyCategoryTableComponent = ({
  data,
  loading,
}: PolicyCategoryTableComponentProps) => {
  const { theme } = useTheme();
  const { policyCategoryStore } = useStore();

  const handleDelete = async (row: PolicyCategoryDto) => {
    await policyCategoryStore.deletePolicyCategory(row.id);
  };

  const columns: TableColumn<PolicyCategoryDto>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "80px",
    },
    {
      name: "Tên danh mục",
      selector: (row) => row.name,
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
      grow: 1.5,
    },
    {
      name: "Mô tả",
      selector: (row) => row.description || "Không có mô tả",
      sortable: false,
      grow: 2,
    },
    {
      name: "Ngày tạo",
      selector: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
      sortable: true,
      minWidth: "130px",
    },
    {
      name: "Hành động",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row)}
          data-tooltip-id="policy-category-delete-tooltip"
          data-tooltip-content="Xóa"
        >
          <CiTrash className="w-5 h-5 text-red-600 hover:opacity-60" />
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
      <Tooltip id="policy-category-delete-tooltip" className="text-md" />
    </div>
  );
};

export default observer(PolicyCategoryTableComponent);