import React from 'react'
import { FaEye } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { BsFileEarmarkPpt } from "react-icons/bs";
import ProductLabel from '../../components/form/product-form/ProductLabel';

const UsageGuide: React.FC = () => {
  return (
    <div className="p-6 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Hướng dẫn sử dụng
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Tài liệu hướng dẫn sử dụng cho User và Admin trong hệ thống quản lý sản phẩm.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">VD Mã Sản Phẩm: <b>BS.MB.41-C1.84 </b></h3>
          <li><b>Nhóm 1 (BS):</b> Mã ngắn của Bề Mặt</li>
          <li><b>Nhóm 2 (MB):</b> Mã ngắn của Hệ Vân</li>
          <li><b>Nhóm 3 (41):</b> Khu Vực Công Ty</li>
          <li className='flex item-center gap-1'><b>Nhóm 4 (C1):</b> Phân Loại Nhà Cung Cấp <ProductLabel
            htmlFor="customerClassification"
            tooltipId="unique-tooltip-id"
            tooltip={`D: DISTRIBUTORS ( NHÀ PHÂN PHỐI )\nF: FACTORY ( NHÀ MÁY SẢN XUẤT )\nC: COMPANY ( CÔNG TY THÀNH CHUNG )\nP: PUBLIC ( MÃ HÀNG - NHIỀU NCC )`}
          > </ProductLabel> </li> 
          <li><b>Nhóm 5 (84):</b> Số thứ tự</li>

          <h3 className="text-lg text-gray-900 dark:text-white"><b>Bảng Mã Khu Vực</b></h3>
          <div>
            <a 
              href="/docs/Bảng%20Mã%20Khu%20Vực.pdf" 
              download
              className="btn-download bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block text-center"
            >
              Tải xuống Bảng Mã Khu Vực
            </a>
          </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mã Hàng</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Sản Phẩm -{'>'} <b>Mã Hàng</b> .</li>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Tạo Mã Hàng:</b> Dẫn đến trang tạo mã hàng và nhập thông tin cần thiết.</li>
          <li><b>Nhập File:</b> Cho phép nhập dữ liệu mã hàng từ file Excel <b>(Chưa hoàn thiện)</b>.</li>
          <li><b>Xuất File:</b> Cho phép xuất dữ liệu mã hàng ra file Excel.</li>
          <li><b>Nâng Cao:</b> Bộ lọc giúp hiển thị dữ liệu theo 2 tiêu chí: Nhà Cung Cấp và Kích Thước </li>

          <br />
          <img src="/images/guide/Mã%20Hàng%20Page.jpg" alt="Tạo Mã Hàng" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chia làm 3 nhóm chính: </h3>
          <h4 className="text-lg text-gray-900 dark:text-white">Nhóm thứ 1 - <b>Nhóm định danh mã hàng</b></h4>
          <li>Mã Hàng sử dụng cho Website</li>
          <li>Mã Nhà Cung Cấp</li>
          <li>Mã Gốc - mã hàng hóa từ nhà cung cấp đặt tên</li>
          <h4 className="text-lg text-gray-900 dark:text-white">Nhóm thứ 2 - <b>Nhóm về giá</b></h4>
          <li>Giá gốc - giá trước khuyến mãi (đã bao gồm giá niêm yết nhập từ nhà cung cấp)</li>
          <li>Giá KM - giá sau khuyến mãi dựa theo chính sách cty đưa ra</li>
          <li><b>(Các giá trên đã bao gồm lợi nhuận cho cty)</b></li>
          <h4 className="text-lg text-gray-900 dark:text-white">Nhóm thứ 3 - <b>Nhóm về thao tác</b></h4>
          <li className="flex items-center gap-1">
            <CgWebsite className="w-6 h-6 hover:opacity-50" />
            <span>: Hiển thị thông tin liên quan đến mã hàng để upload website.</span>
          </li>
          <li className="flex items-center gap-1">
            <BsFileEarmarkPpt className="w-6 h-6 hover:opacity-50" />
            <span>: Hiển thị thông tin liên quan đến mã hàng để upload Mã Dự Án <b>(Chưa hoàn thiện).</b></span>
          </li>
          <li className="flex items-center gap-1">
            <FaEye className="w-6 h-6 hover:opacity-50" />
            <span>: Xem chi tiết thông tin mã hàng.</span>
          </li>

          <br />
          <img src="/images/guide/Mã%20Hàng%20Chi%20Tiết_1.jpg" alt="Tạo Mã Hàng" className="w-full h-auto rounded-lg" />
          <br />

          <br/>
          <img src="/images/guide/Mã%20Hàng%20Chi%20Tiết_2.jpg" alt="Tạo Mã Hàng" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">VD Mã: <b>TCT-GACH-41D3 | 10x10TCT </b></h3>
          <li><b>10x10TCT:</b> kích thước dài x kích thước rộng + tên viết tắt chữ cái đầu NCC</li>
          <li><b>Tên Tiếng Anh:</b> Tùy mặt hàng (không bắt buộc)</li>
          <li><b>Nhà Máy:</b> Tùy mặt hàng (không bắt buộc)</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <li className="flex items-center gap-2">
          <CgWebsite className="w-6 h-6 hover:opacity-50" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin chi tiết mã hàng</h2>
        </li>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Thông%20Tin%20Website%20Form.png" alt="Tạo Mã Hàng" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đối Với Google Keeps: </h3>
          <li>Copy nội dung trong phần <b>Thông tin kỹ thuật</b>. copy tới dải phân cách <b>"----"</b></li>
          <li>Tạo mới một trang <a href="https://keep.google.com/u/0/#label/TCT%20GROUP" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-semibold">Google Keep</a> và dán nội dung đã copy.</li>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Đối Với Đăng Website TCT Homemart: </h3>
          <li>Copy mã sản phẩm</li>
          <li>Copy các thông số liên quan trong và sau phần <b>Thông tin kỹ thuật</b></li>
          <li>Chọn <b>Sản Phẩm</b> -{'>'} <b>Thêm mới</b></li>
          <li>Dán mã ngắn vào phần nội dung và lưu lại.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Hệ Vân</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Hệ%20Vân%20Page.png" alt="Page Hệ Vân" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Hệ Vân</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Hệ Vân: </h3>
          <img src="/images/guide/Hệ%20Vân%20Form.png" alt="Form Hệ Vân" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Hệ Vân</b> để tạo hệ vân mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Tên Hệ Vân:</b> Tên của hệ vân cần tạo.</li>
          <li><b>Mã Hệ Vân:</b> Mã của hệ vân cần tạo.</li>
          <li><b>Ký Hiệu:</b> Ký hiệu của hệ vân cần tạo. (trường hợp đặc biệt)</li>
          <li><b>Ghi Chú:</b> Thông tin ghi chú thêm cho hệ vân.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Nhà Cung Cấp</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Nhà%20Cung%20Cấp%20Page.png" alt="Page Nhà Cung Cấp" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Nhà Cung Cấp</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Nhà Cung Cấp: </h3>
          <img src="/images/guide/Nhà%20Cung%20Cấp%20Form.png" alt="Form Nhà Cung Cấp" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Nhà Cung Cấp</b> để tạo nhà cung cấp mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Sản Phẩm Nhà Cung Cấp:</b> Sản phẩm của nhà cung cấp đó (GACH, TONGHOP, ...).</li>
          <li><b>Tên Nhà Cung Cấp:</b> Tên của nhà cung cấp cần tạo.</li>
          <li><b>Khu Vực:</b> Khu vực của nhà cung cấp cần tạo (Được tạo theo biển số xe).</li>
          <li className='flex items-center gap-1'><b>Phân Loại Khách Hàng:</b> Phân loại khách hàng của nhà cung cấp (Đưa chuột vào dấu ? để xem chi tiết).
          <ProductLabel
            htmlFor="customerClassification"
            tooltipId="unique-tooltip-id"
            tooltip={`D: DISTRIBUTORS ( NHÀ PHÂN PHỐI )\nF: FACTORY ( NHÀ MÁY SẢN XUẤT )\nC: COMPANY ( CÔNG TY THÀNH CHUNG )\nP: PUBLIC ( MÃ HÀNG - NHIỀU NCC )`}
          > </ProductLabel> 
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Nhà Máy</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Nhà%20Máy%20Page.png" alt="Page Nhà Máy" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Nhà Máy</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Nhà Máy: </h3>
          <img src="/images/guide/Nhà%20Máy%20Form.png" alt="Form Nhà Máy" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Nhà Máy</b> để tạo nhà máy mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Nhà Máy:</b> Mã của nhà máy cần tạo.</li>
          <li><b>Tên Nhà Máy:</b> Tên của nhà máy cần tạo.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Bề Mặt</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Bề%20Mặt%20Page.png" alt="Page Bề Mặt" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Bề Mặt</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Bề Mặt: </h3>
          <img src="/images/guide/Bề%20Mặt%20Form.png" alt="Form Bề Mặt" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Bề Mặt</b> để tạo bề mặt mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Bề Mặt:</b> Mã của bề mặt cần tạo.</li>
          <li><b>Mô Tả Bề Mặt:</b> Mô tả của bề mặt cần tạo.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Chất Liệu</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Chất%20Liệu%20Page.png" alt="Page Chất Liệu" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Chất Liệu</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Chất Liệu: </h3>
          <img src="/images/guide/Chất%20Liệu%20Form.png" alt="Form Chất Liệu" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Chất Liệu</b> để tạo chất liệu mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Chất Liệu:</b> Mã của chất liệu cần tạo.</li>
          <li><b>Mô Tả Chất Liệu:</b> Mô tả của chất liệu cần tạo.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Màu Sắc</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Màu%20Sắc%20Page.png" alt="Page Màu Sắc" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Màu Sắc</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Màu Sắc: </h3>
          <img src="/images/guide/Màu%20Sắc%20Form.png" alt="Form Màu Sắc" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Màu Sắc</b> để tạo màu sắc mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Màu Sắc:</b> Mã của màu sắc cần tạo.</li>
          <li><b>Mã Màu Sắc:</b> Mã màu tự tạo khi chọn màu bên bảng màu</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Màu Xương Gạch</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Màu%20Xương%20Gạch%20Page.png" alt="Page Màu Xương Gạch" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Màu Xương Gạch</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Màu Xương Gạch: </h3>
          <img src="/images/guide/Màu%20Xương%20Gạch%20Form.png" alt="Form Màu Xương Gạch" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Màu Xương Gạch</b> để tạo màu sắc mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Tên Màu Xương Gạch:</b> Tên của màu xương gạch cần tạo.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Xuất Xứ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Xuất%20Xứ%20Page.png" alt="Page Xuất Xứ" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Xuất Xứ</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Xuất Xứ: </h3>
          <img src="/images/guide/Xuất%20Xứ%20Form.png" alt="Form Xuất Xứ" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Xuất Xứ</b> để tạo xuất xứ mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Tên Xuất Xứ:</b> Tên của xuất xứ cần tạo.</li>
          <li><b>Mã Xuất Xứ:</b> Mã của xuất xứ cần tạo.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Kích Thước</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Kích%20Thước%20Page.png" alt="Page Kích Thước" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Kích Thước</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Kích Thước: </h3>
          <img src="/images/guide/Kích%20Thước%20Form.png" alt="Form Kích Thước" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Kích Thước</b> để tạo kích thước mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Công Ty:</b> Mã này ứng với (Chiều Rộng x Dài) % 10 (cm).</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Mã Công Ty</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Mã%20Công%20Ty%20Page.png" alt="Page Mã Công Ty" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Mã Công Ty</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Mã Công Ty: </h3>
          <img src="/images/guide/Mã%20Công%20Ty%20Form.png" alt="Form Mã Công Ty" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Mã Công Ty</b> để tạo mã công ty mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Công Ty:</b> Mã này ứng với (Chiều Rộng x Dài) % 10 (cm) -TCT.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Gia Công</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Gia%20Công%20Page.png" alt="Page Gia Công" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Gia Công</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Gia Công: </h3>
          <img src="/images/guide/Gia%20Công%20Form.png" alt="Form Gia Công" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Gia Công</b> để tạo dịch vụ gia công mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã gia công:</b> Mã của dịch vụ gia công.</li>
          <li><b>Mô tả gia công:</b> Mô tả về dịch vụ gia công.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Kho Hàng</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Kho%20Hàng%20Page.png" alt="Page Kho Hàng" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Kho Hàng</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Kho Hàng: </h3>
          <img src="/images/guide/Kho%20Hàng%20Form.png" alt="Form Kho Hàng" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Kho Hàng</b> để tạo kho hàng mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Hình Thức Giao Hàng:</b> Loại hình thức giao hàng.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Mức Độ Chống Trơn Trượt</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Mức%20Độ%20Chống%20Trơn%20Trượt%20Page.png" alt="Page Mức Độc Chống Trơn Trượt" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Mức Độc Chống Trơn Trượt</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Mức Độc Chống Trơn Trượt: </h3>
          <img src="/images/guide/Mức%20Độ%20Chống%20Trơn%20Trượt%20Form.png" alt="Form Mức Độc Chống Trơn Trượt" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Mức Độc Chống Trơn Trượt</b> để tạo mức độc chống trơn trượt mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Mã Mức Độ Chống Trơn Trượt:</b> Mã của mức độ chống trơn trượt.</li>
          <li><b>Mô Tả Mức Độ Chống Trơn Trượt:</b> Mô tả về mức độ chống trơn trượt.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Mức Độ Hút Nước</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Mức%20Độ%20Hút%20Nước%20Page.png" alt="Page Mức Độc Hút Nước" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Mức Độc Hút Nước</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Mức Độc Hút Nước: </h3>
          <img src="/images/guide/Mức%20Độ%20Hút%20Nước%20Form.png" alt="Form Mức Độc Hút Nước" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Mức Độc Hút Nước</b> để tạo mức độc hút nước mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Ký Hiệu Mức Độ Hút Nước:</b> Ký hiệu của mức độ hút nước. (Ví dụ: {'>'}, {'<'}, =)</li>
          <li><b>Số Liệu Mức Độ Hút Nước:</b> Số liệu về mức độ hút nước.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hướng dẫn Đơn Vị Tính</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">

          <img src="/images/guide/Đơn%20Vị%20Tính%20Page.png" alt="Page Đơn Vị Tính" className="w-full h-auto rounded-lg" />
          <br />

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cách Truy Vấn: </h3>
          <li>Truy vấn vào Menu Danh Mục Sản Phẩm -{'>'} <b>Đơn Vị Tính</b> .</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Đơn Vị Tính: </h3>
          <img src="/images/guide/Đơn%20Vị%20Tính%20Form.png" alt="Form Đơn Vị Tính" className="w-full h-auto rounded-lg" />
          <br />
          <li>Chọn <b>Tạo Đơn Vị Tính</b> để tạo đơn vị tính mới.</li>
          <li>Nhập thông tin cần thiết và nhấn <b>Lưu</b>.</li>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông Tin Cơ Bản: </h3>
          <li><b>Tên Đơn Vị Tính:</b> Tên của đơn vị tính.</li>
          <li><b>Đơn Vị Tính Tự Động:</b> Tên cho bên kỹ thuật code lưu vào database.</li>
        </ul>
      </section>
    </div>
  )
}

export default UsageGuide