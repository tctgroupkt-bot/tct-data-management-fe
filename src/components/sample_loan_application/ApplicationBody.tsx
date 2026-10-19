import { useRef, useState } from "react";
import { formatDateLocalString } from "../../app/common/common";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import SignatureCanvas from 'react-signature-canvas';
import Button from "../ui/button/Button";
import Modal from "../ui/modal";

const ApplicationBody = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const signatureCanvasRef = useRef<SignatureCanvas | null>(null);

    // State cho các checkbox
    const [tinhTrangMau, setTinhTrangMau] = useState({
        khanCap: false,
        binhThuong: false,
        coTheCham: false,
        tinhTrangKhac: false,
    });

    const [phanLoaiDeXuat, setPhanLoaiDeXuat] = useState({
        daiLyCamKet: false,
        daiLyKhongCamKet: false,
        kienTrucSu: false,
        khachLe: false,
        tuVanThietKe: false,
        showroom: false,
        chuoiShop: false,
        nhaThauXayDung: false,
        online: false,
        duAn: false,
        chuDauTu: false,
        capLaiMau: false,
    });

    const [phanLoaiCongTrinh, setPhanLoaiCongTrinh] = useState({
        bietThu: false,
        canHo: false,
        congTrinhCongCong: false,
        resort: false,
        khachSan: false,
        khoXuong: false,
        benhVien: false,
        quanCafeNhaHang: false,
        showroomCongTrinh: false,
        nhaPho: false,
        trungTamThuongMai: false,
        khac: false,
    });

    const [phanLoaiVanChuyen, setPhanLoaiVanChuyen] = useState({
        nhanTaiKho: false,
        nhanTaiVP: false,
        khachChiuPhi: false,
        nvbhChiuPhi: false,
        akBookShipCod: false,
        akBookShipCongNo: false,
        akBookShipTuTra: false,
    });

    const [tinhTrangMauSection, setTinhTrangMauSection] = useState({
        daKiemTra: false,
        chuaCoMau: false,
    });

    const [hanTraMau, setHanTraMau] = useState("");

    // State cho các input fields
    const [thongTinKhachHang, setThongTinKhachHang] = useState({
        tenKhachHang: "",
        soDienThoai: "",
        diaChiNhanHang: "",
    });
    const [nguoiDeXuatHoTen, setNguoiDeXuatHoTen] = useState("");

    const clearSignature = () => {
    signatureCanvasRef.current?.clear();
    };

    const saveSignature = () => {
        const signatureImage = signatureCanvasRef.current?.toDataURL();
        if (!signatureImage) return;
        setSignatureDataUrl(signatureImage);
        setIsModalOpen(false);
    };
    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-5 space-y-2">
                    <h1 className="underline text-[#334355] font-bold">I. THÔNG TIN KHÁCH HÀNG</h1>
                    <span className="list-disc space-y-2">
                        <li className="ml-4">Tên khách hàng:</li>
                        <Input 
                            className="w-full" 
                            placeholder="Nhập tên khách hàng.."
                            value={thongTinKhachHang.tenKhachHang}
                            onChange={(e) => setThongTinKhachHang({...thongTinKhachHang, tenKhachHang: e.target.value})}
                        />
                        <li className="ml-4">Số điện thoại:</li>
                        <Input 
                            className="w-full" 
                            placeholder="Nhập số điện thoại.."
                            value={thongTinKhachHang.soDienThoai}
                            onChange={(e) => setThongTinKhachHang({...thongTinKhachHang, soDienThoai: e.target.value})}
                        />
                        <li className="ml-4">Địa chỉ:</li>
                        <TextArea 
                            className="w-full" 
                            placeholder="Nhập địa chỉ.."
                            value={thongTinKhachHang.diaChiNhanHang}
                            onChange={(value) => setThongTinKhachHang({...thongTinKhachHang, diaChiNhanHang: value})}
                        />
                    </span>
                    <div className="my-4">
                    <span className="underline text-[#334355] font-bold">
                        TÌNH TRẠNG MẪU
                    </span>
                    </div>
                    <div className="space-y-4">
                        <Checkbox checked={tinhTrangMau.khanCap} onChange={(checked) => setTinhTrangMau({...tinhTrangMau, khanCap: checked})} label="Khẩn cấp" />
                        <Checkbox checked={tinhTrangMau.binhThuong} onChange={(checked) => setTinhTrangMau({...tinhTrangMau, binhThuong: checked})} label="Bình thường" />
                        <Checkbox checked={tinhTrangMau.coTheCham} onChange={(checked) => setTinhTrangMau({...tinhTrangMau, coTheCham: checked})} label="Có thể chậm" />
                        <Checkbox checked={tinhTrangMau.tinhTrangKhac} onChange={(checked) => setTinhTrangMau({...tinhTrangMau, tinhTrangKhac: checked})} label="Tình trạng khác" />
                    </div>
                </div>
                <div className="col-span-7 space-y-4">
                    <h1 className="underline text-[#334355] font-bold">II. PHÂN LOẠI ĐỀ XUẤT TRÌNH MẪU</h1>
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 space-y-4">
                            <Checkbox id="deXuat1" checked={phanLoaiDeXuat.daiLyCamKet} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, daiLyCamKet: checked})} label="Đại lý cam kết" />
                            <Checkbox id="deXuat2" checked={phanLoaiDeXuat.daiLyKhongCamKet} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, daiLyKhongCamKet: checked})} label="Đại lý không cam kết" />
                            <Checkbox id="deXuat3" checked={phanLoaiDeXuat.kienTrucSu} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, kienTrucSu: checked})} label="Kiến trúc sư" />
                            <Checkbox id="deXuat4" checked={phanLoaiDeXuat.khachLe} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, khachLe: checked})} label="Khách lẻ" />
                        </div>
                        <div className="col-span-4 space-y-4">
                            <Checkbox id="deXuat5" checked={phanLoaiDeXuat.tuVanThietKe} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, tuVanThietKe: checked})} label="Tư vấn thiết kế" />
                            <Checkbox id="deXuat6" checked={phanLoaiDeXuat.showroom} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, showroom: checked})} label="Showroom" />
                            <Checkbox id="deXuat7" checked={phanLoaiDeXuat.chuoiShop} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, chuoiShop: checked})} label="Chuỗi - shop" />
                            <Checkbox id="deXuat8" checked={phanLoaiDeXuat.nhaThauXayDung} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, nhaThauXayDung: checked})} label="Nhà thầu xây dựng" />
                        </div>
                        <div className="col-span-4 space-y-4">
                            <Checkbox id="deXuat9" checked={phanLoaiDeXuat.online} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, online: checked})} label="Online" />
                            <Checkbox id="deXuat10" checked={phanLoaiDeXuat.duAn} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, duAn: checked})} label="Dự án" />
                            <Checkbox id="deXuat11" checked={phanLoaiDeXuat.chuDauTu} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, chuDauTu: checked})} label="Chủ đầu tư" />
                            <Checkbox id="deXuat12" checked={phanLoaiDeXuat.capLaiMau} onChange={(checked) => setPhanLoaiDeXuat({...phanLoaiDeXuat, capLaiMau: checked})} label="Cấp lại mẫu" />
                        </div>
                    </div>
                    <h1 className="underline text-[#334355] font-bold">III. PHÂN LOẠI CÔNG TRÌNH</h1>
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 space-y-4">
                            <Checkbox id="congTrinh1" checked={phanLoaiCongTrinh.bietThu} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, bietThu: checked})} label="Biệt thự" />
                            <Checkbox id="congTrinh2" checked={phanLoaiCongTrinh.canHo} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, canHo: checked})} label="Căn hộ" />
                            <Checkbox id="congTrinh3" checked={phanLoaiCongTrinh.congTrinhCongCong} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, congTrinhCongCong: checked})} label="Công trình công cộng" />
                            <Checkbox id="congTrinh4" checked={phanLoaiCongTrinh.resort} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, resort: checked})} label="Resort" />
                        </div>
                        <div className="col-span-4 space-y-4">
                            <Checkbox id="congTrinh5" checked={phanLoaiCongTrinh.khachSan} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, khachSan: checked})} label="Khách sạn" />
                            <Checkbox id="congTrinh6" checked={phanLoaiCongTrinh.khoXuong} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, khoXuong: checked})} label="Kho / xưởng" />
                            <Checkbox id="congTrinh7" checked={phanLoaiCongTrinh.benhVien} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, benhVien: checked})} label="Bệnh viện" />
                            <Checkbox id="congTrinh8" checked={phanLoaiCongTrinh.quanCafeNhaHang} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, quanCafeNhaHang: checked})} label="Quán cafe / Nhà hàng" />
                        </div>
                        <div className="col-span-4 space-y-4">
                            <Checkbox id="congTrinh9" checked={phanLoaiCongTrinh.showroomCongTrinh} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, showroomCongTrinh: checked})} label="Showroom" />
                            <Checkbox id="congTrinh10" checked={phanLoaiCongTrinh.nhaPho} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, nhaPho: checked})} label="Nhà phố" />
                            <Checkbox id="congTrinh11" checked={phanLoaiCongTrinh.trungTamThuongMai} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, trungTamThuongMai: checked})} label="Trung tâm thương mại" />
                            <Checkbox id="congTrinh12" checked={phanLoaiCongTrinh.khac} onChange={(checked) => setPhanLoaiCongTrinh({...phanLoaiCongTrinh, khac: checked})} label="Khác" />
                        </div>
                    </div>
                    <h1 className="underline text-[#334355] font-bold">IV. PHƯƠNG THỨC VẬN CHUYỂN</h1>
                    <div className="grid grid-cols-12">
                        <div className="col-span-3 space-y-4">
                            <Checkbox id="vanChuyen1" checked={phanLoaiVanChuyen.nhanTaiKho} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, nhanTaiKho: checked})} label="Nhận tại kho" />
                        </div>
                        <div className="col-span-3 space-y-4">
                            <Checkbox id="vanChuyen2" checked={phanLoaiVanChuyen.nhanTaiVP} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, nhanTaiVP: checked})} label="Nhận tại VP" />
                        </div>
                        <div className="col-span-3 space-y-4">
                            <Checkbox id="vanChuyen3" checked={phanLoaiVanChuyen.khachChiuPhi} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, khachChiuPhi: checked})} label="Khách chịu phí" />
                        </div>
                        <div className="col-span-3 space-y-4">
                            <Checkbox id="vanChuyen4" checked={phanLoaiVanChuyen.nvbhChiuPhi} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, nvbhChiuPhi: checked})} label="NVBH chịu phí" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Checkbox id="vanChuyen5" checked={phanLoaiVanChuyen.akBookShipCod} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, akBookShipCod: checked})} label="TCT book ship - ship trực tiếp (COD)" description="Vui lòng note tên người thanh toán vào phần địa chỉ giao hàng"/>
                        <Checkbox id="vanChuyen6" checked={phanLoaiVanChuyen.akBookShipCongNo} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, akBookShipCongNo: checked})} label="TCT book ship - Tiền ship đưa vào công nợ" />
                        <Checkbox id="vanChuyen7" checked={phanLoaiVanChuyen.akBookShipTuTra} onChange={(checked) => setPhanLoaiVanChuyen({...phanLoaiVanChuyen, akBookShipTuTra: checked})} label="TCT ghép chuyến vận chuyển về kho" description="Gửi kèm bằng chứng duyệt" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-5 space-y-4">
                    <h1 className="underline text-[#334355] font-bold">V. TÌNH TRẠNG MẪU</h1>
                    <div className="space-y-4">
                        <Checkbox id="tinhTrangMau1" checked={tinhTrangMauSection.daKiemTra} onChange={(checked) => setTinhTrangMauSection({...tinhTrangMauSection, daKiemTra: checked})} label="Đã kiểm tra có mẫu" />
                        <Checkbox id="tinhTrangMau2" checked={tinhTrangMauSection.chuaCoMau} onChange={(checked) => setTinhTrangMauSection({...tinhTrangMauSection, chuaCoMau: checked})} label="Chưa có mẫu, cần mua mẫu" description="Gửi kèm bằng chứng duyệt" />
                    </div>
                </div>
                <div className="col-span-7 space-y-4">
                    <h1 className="underline text-[#334355] font-bold">VI. HẠN TRẢ MẪU</h1>
                    <div className="space-y-4">
                        <div className="w-1/3 mr-24">
                            <Input
                                className="w-full text-center"
                                placeholder="Nhập hạn trả mẫu"
                                value={hanTraMau}
                                onChange={(e) => setHanTraMau(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <h1 className="underline text-red-500 font-bold">LƯU Ý QUAN TRỌNG:</h1>
                <ul className="mx-4 text-lg list-disc">
                    <li className="italic">Vui lòng đính kèm Phiếu này cùng đơn hàng để Phòng mua hàng có cơ sở xử lý.</li>
                    <li className="italic">Phòng mua hàng sẽ chỉ xử lý khi đã được cung cấp đầy đủ các thông tin theo mẫu này.</li>
                    <li className="italic">Trường hợp thiếu thông tin hoặc chưa có sự phê duyệt của cấp có thẩm quyền, đơn hàng sẽ không được xử lý.</li>
                </ul>
            </div>
            <div className="flex justify-around">
                <div></div>
                <div>
                    <span className="italic text-[#334355]">
                        Ngày: {formatDateLocalString(new Date().toISOString())}
                    </span>
                </div>
            </div>
            <div className="flex justify-around">
                <div></div>
                <div>
                    <span className="italic text-[#334355]">
                        Người đề xuất
                    </span>
                </div>
            </div>
            <div className="flex justify-around">
                <div></div>
                <div className="mr-3">
                    <span onClick={() => setIsModalOpen(true)} className="italic cursor-pointer text-[#334355]">
                        (Ký tên)
                    </span>
                </div>
            </div>
            <div className="flex justify-end">
                <div></div>
                <div className="w-1/3 mr-24">
                    {signatureDataUrl && (
                        <img src={signatureDataUrl} alt="signature" className="w-full" />
                    )}
                </div>
            </div>
            <div className="flex justify-around">
                <div></div>
                <div className="ml-32">
                    <span className="text-[#334355]">
                        ________________________
                    </span>
                </div>
            </div>
            <div className="flex justify-end">
                <div></div>
                <div className="w-1/3 mr-24">
                    <Input
                        className="w-full text-center"
                        placeholder="Nhập họ tên người đề xuất"
                        value={nguoiDeXuatHoTen}
                        onChange={(e) => setNguoiDeXuatHoTen(e.target.value)}
                    />
                </div>
            </div>

            <Modal className="w-full max-w-2xl" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6 space-y-4">
                    <h1 className="text-2xl font-bold">Ký tên</h1>
                    <p className="text-sm text-gray-600">
                        Dùng chuột (hoặc tay trên màn hình cảm ứng) để ký vào khung bên dưới.
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-3 flex justify-center items-center">
                        <SignatureCanvas
                            ref={signatureCanvasRef}
                            penColor="#000"
                            canvasProps={{
                                width: 600,
                                height: 100,
                                className: "w-full h-[100px] text-center justify-center items-center"
                            }}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={clearSignature}>Xóa</Button>
                        <Button className="bg-brand-500 text-white hover:bg-brand-600" onClick={saveSignature}>Lưu</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ApplicationBody;