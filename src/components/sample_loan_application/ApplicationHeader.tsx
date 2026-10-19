import { useState } from "react";

const applicationTitleOptions = [
    "PHIẾU THÔNG TIN XUẤT MẪU TRÌNH",
    "PHIẾU THÔNG TIN NHẬP MẪU TRÌNH",
    "PHIẾU THÔNG TIN TRẢ HÀNG",
];

const ApplicationHeader = () => {
    const [selectedTitle, setSelectedTitle] = useState(applicationTitleOptions[0]);

    const [employeeName, setEmployeeName] = useState("");

    const [orderId, setOrderId] = useState("");

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-1 mb-4 h-auto grid grid-cols-2">
          <img
            src="/images/logo/tctlogo.svg"
            alt="logo"
            className="w-32 h-32"
          />
          <div className="flex flex-col items-end justify-center p-4 text-blue-900">
            <span className="font-bold">
              CÔNG TY TNHH TẬP ĐOÀN THƯƠNG MẠI THÀNH CHUNG
            </span>
            <span className="text-sm font-bold">
              427 TÔ HIẾN THÀNH, PHƯỜNG DIÊN HỒNG, TP. HỒ CHÍ MINH
            </span>
            <span className="text-sm font-bold">
              SDT: 08 183 183 58 - WWW.TCTHOMEMART.COM
            </span>
            <div className="flex items-center mt-2 text-sm">
              <span className="mr-2 w-full">Mã Hóa Đơn:</span>
              <input
                type="text"
                className="w-full text-center border-0 bg-transparent outline-none"
                placeholder="Nhập mã hóa đơn.."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="mr-2 w-full">Người lập phiếu:</span>
              <input
                type="text"
                className="w-full text-center border-0 bg-transparent outline-none"
                placeholder="Nhập tên nhân viên.."
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <select
          aria-label="Chọn loại phiếu"
          value={selectedTitle}
          onChange={(event) => setSelectedTitle(event.target.value)}
          className="cursor-pointer border-0 bg-transparent text-xl font-bold text-[#334355] text-center outline-none"
        >
          {applicationTitleOptions.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        <span className="italic text-sm">
          Thông tin sẽ giúp chúng tôi tư vấn chính xác & tiết kiệm thời gian cho
          anh/chị
        </span>
      </div>
    );
}

export default ApplicationHeader;