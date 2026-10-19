import { useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ApplicationBody from "../../components/sample_loan_application/ApplicationBody";
import ApplicationHeader from "../../components/sample_loan_application/ApplicationHeader";
import Button from "../../components/ui/button/Button";
import { useReactToPrint } from "react-to-print";
import { formatDateLocalString } from "../../app/common/common";

const SampleBorrowApplicationPage = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Cấu hình in ấn
  const handlePrint = useReactToPrint({
    contentRef: printRef, // <--- SỬA DÒNG NÀY (Đổi content -> contentRef, bỏ arrow function)
    documentTitle: "Phiếu_Đề_Xuất_Mẫu_Trình_" + formatDateLocalString(new Date().toISOString()),
    onAfterPrint: () => console.log("Đã in xong"),
  });

  return (
    <div>
      {/* CSS Global chỉ dành riêng cho lúc In để xử lý Scale và Margin */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait; /* Khổ A4 dọc */
            margin: 0mm; /* Bỏ margin mặc định của trình duyệt để tránh trang trắng */
          }

          body {
            /* Giữ màu background chính xác (quan trọng cho Tailwind) */
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }

          /* Class này bọc nội dung in để scale */
          .print-content {
            /* Mẹo: Zoom 70% để thu nhỏ nội dung như bạn muốn */
            zoom: 0.75; 
            width: 100%;
            margin: 0 auto;
            padding: 20px; /* Thêm padding giả lập margin giấy sau khi zoom */
          }
        }
      `}</style>

      <PageMeta
        title="Phiếu Đề Xuất Mẫu"
        description="Phiếu Thông Tin Đề Xuất Mẫu Trình"
      />
      <PageBreadcrumb pageTitle="Phiếu Đề Xuất Mẫu" />

      <div className="bg-white border border-gray-200 rounded-lg">
        <div ref={printRef}>
          <div className="print-content space-y-4 p-4">
            <ApplicationHeader />
            <ApplicationBody />
          </div>
        </div>
      </div>
      <div className="no-print space-x-3 mt-4 flex justify-end">
        <Button
          size="sm"
          onClick={handlePrint}
          className="px-3 py-1 bg-[#334355] text-white rounded cursor-pointer hover:bg-[#263240] transition-colors"
        >
          Xuất PDF
        </Button>
      </div>
    </div>
  );
};

export default SampleBorrowApplicationPage;
