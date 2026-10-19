import { ProductDetail } from "../models/product/product.model";

export interface TechnicalInfoTemplate {
  id: string;
  name: string;
  patternIds: number[]; // IDs của các pattern sử dụng template này
  template: (product: ProductDetail, waterAbsorptionValue: string, sizeList: any[], colorList: any[], surfaceList: any[], materialList: any[], patternList: any[], bodyColorList?: any[], supplierName?: string) => string;
}

// Template cho gạch Art (pattern nghệ thuật)
const artTemplate: TechnicalInfoTemplate = {
  id: "art",
  name: "Gạch Vân Họa Tiết Nghệ Thuật",
  patternIds: [], // Sẽ được cập nhật sau khi biết pattern IDs
  template: (product: ProductDetail, waterAbsorptionValue: string, sizeList: any[], colorList: any[], surfaceList: any[], materialList: any[], bodyColorList: any[]) => {
    const size = sizeList.find(x => x.id === product.actualSizeId);
    const sizeText = size ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm` : "30x60";
    const color = colorList.find(x => x.id === product.colorId)?.name || "Đa sắc";
    const surface = surfaceList.find(x => x.id === product.surfaceFeatureId)?.name || "Sần nổi";
    const material = materialList.find(x => x.id === product.materialId)?.name || "Semi-Porcelain";
    const bodyColor = bodyColorList.find(x => x.id === product.brickBodyId)?.name || "kem";
    
    return `<h1>Gạch Vân Họa Tiết Nghệ Thuật ${sizeText} ${color} ${surface} ${product.confirmAutoBarCode}</h1>
Thổi một luồng gió mới đầy nghệ thuật vào không gian sống của bạn với mẫu <b><a href="https://tcthomemart.com/gach-trang-tri">gạch trang trí ${sizeText}</b> ${product.confirmAutoBarCode}. Sản phẩm là sự kết hợp tinh tế giữa sắc ${color.toLowerCase()} độc đáo, vân họa tiết nghệ thuật và bề mặt ${surface.toLowerCase()} 3D sống động, hứa hẹn sẽ trở thành điểm nhấn không thể rời mắt cho bất kỳ bức tường nào.

<h2><b>Đặc Điểm Nổi Bật Của Mẫu Gạch Trang Trí ${sizeText}</b></h2>
<ul>
         <li><b><a href="https://tcthomemart.com/danh-muc-san-pham/nhom/art-gach-van-hoa-tiet-nghe-thuat/">Họa Tiết Nghệ Thuật</a> Độc Đáo:</b> Với những đường vân họa tiết lấy cảm hứng từ nghệ thuật đương đại trên nền sắc ${color.toLowerCase()} đầy mê hoặc, mẫu gạch này không chỉ dùng để ốp lát mà còn là một tác phẩm trang trí thực thụ, thể hiện gu thẩm mỹ tinh tế của gia chủ.</li>
         <li><b>Bề Mặt ${surface} 3D Sống Động:</b> Công nghệ dập nổi tiên tiến tạo nên một bề mặt ${surface.toLowerCase()} có chiều sâu, bạn có thể cảm nhận được bằng cả thị giác và xúc giác. Hiệu ứng này tạo ra sự tương tác tuyệt vời với ánh sáng, giúp bức tường của bạn trở nên sinh động và cuốn hút ở mọi góc nhìn.</li>
         <li><b>Chất Liệu ${material} (Bán Sứ) Bền Bỉ:</b> Xương gạch bán sứ màu ${bodyColor} không chỉ mang lại kết cấu cứng chắc, chịu lực tốt hơn gạch ceramic thông thường mà còn có độ hút nước thấp, đảm bảo độ bền và vẻ đẹp cho công trình theo thời gian.</li>
         <li><b>Kích Thước <a href="https://tcthomemart.com/danh-muc-san-pham/kich-thuoc/${sizeText.toLowerCase().replace("x", "x")}-cm/">${sizeText}</a> Linh Hoạt:</b> Đây là kích thước "vàng", dễ dàng thi công và phù hợp với nhiều diện tích không gian, từ việc tạo một mảng tường điểm nhấn nhỏ cho đến ốp lát cho cả một bức tường lớn.</li>
</ul>

<h2><strong>Thông Số Kỹ Thuật</strong></h2>
<p style="padding-left: 40px;">Trọng lượng: ${product.weightPerUnit} kg / Viên ~ ${product.weightPerBox} kg / Thùng
Độ hút nước: ${waterAbsorptionValue}
Dùng ốp tường: ${product.isWalling ? "✅" : "❌"}
Sử dụng trong nhà: ${product.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${product.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${product.isEdgeGrinding ? "✅" : "❌"}</p>
<p style="padding-left: 40px;"><!--more--></p>


<h2><b>Gợi Ý Ứng Dụng Cho Gạch Vân Họa Tiết TCT Homemart</b></h2>
Với vẻ đẹp đầy tính nghệ thuật, gạch ${product.confirmAutoBarCode} là lựa chọn lý tưởng để tạo điểm nhấn cho các không gian:
<ul>
         <li><b>Phòng khách:</b> Ốp tường sau kệ TV, vách sofa.</li>
         <li><b>Phòng ngủ:</b> Mảng tường đầu giường.</li>
         <li><b>Không gian bếp:</b> Tường bếp (khu vực backsplash).</li>
         <li><b>Khu vực thương mại:</b> Quầy bar, lễ tân, tường trang trí cho quán cafe, nhà hàng, shop thời trang.</li>
</ul>

<h2><b>Câu Hỏi Thường Gặp (FAQ) Về Gạch Vân Họa Tiết ${product.confirmAutoBarCode}</b></h2>
<ul>
         <li><b>Gạch ${surface.toLowerCase()} có khó vệ sinh không?</b>
<ul>
         <li>Đối với ứng dụng ốp tường, việc vệ sinh hoàn toàn dễ dàng. Bề mặt ${material.toLowerCase()} chống bám bẩn tốt, bạn chỉ cần dùng khăn ẩm mềm hoặc chổi lông để lau bụi định kỳ.</li>
</ul>
</li>
         <li><b>Màu ${color.toLowerCase()} của mẫu gạch này có kén không gian không?</b>
<ul>
         <li>Hoàn toàn không. Sắc ${color.toLowerCase()} của gạch ${product.confirmAutoBarCode} là tông ${color.toLowerCase()} nghệ thuật, có thể đóng vai trò là điểm nhấn màu sắc cho các không gian có tông chủ đạo là trung tính (trắng, xám, kem). Nó cũng kết hợp rất tốt với màu của gỗ tự nhiên và các phụ kiện kim loại.</li>
</ul>
</li>
         <li><b>Tôi có thể sử dụng mẫu gạch trang trí ${sizeText} này cho sàn nhà không?</b>
<ul>
         <li>Sản phẩm này được thiết kế chuyên dụng cho ốp tường để tối ưu hóa hiệu ứng 3D và họa tiết. Chúng tôi không khuyến nghị sử dụng để lát sàn, đặc biệt là ở những khu vực đi lại nhiều.</li>
</ul>
</li>
</ul>

<p style="padding-left: 40px;">Công ty chịu trách nhiệm SP: CÔNG TY TNHH TẬP ĐOÀN THƯƠNG MẠI THÀNH CHUNG
Địa chỉ trụ sở: 427 TÔ HIẾN THÀNH, PHƯỜNG DIÊN HỒNG, TP. HỒ CHÍ MINH.</p>`;
  }
};

// Template cho gạch lát sàn
const floorTileTemplate: TechnicalInfoTemplate = {
  id: "floor",
  name: "Gạch Lát Sàn",
  patternIds: [],
  template: (product: ProductDetail, waterAbsorptionValue: string, sizeList: any[], colorList: any[], surfaceList: any[], materialList: any[]) => {
    const size = sizeList.find(x => x.id === product.actualSizeId);
    const sizeText = size ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm` : "60x60";
    const color = colorList.find(x => x.id === product.colorId)?.name || "Trắng";
    const surface = surfaceList.find(x => x.id === product.surfaceFeatureId)?.name || "Bóng";
    const material = materialList.find(x => x.id === product.materialId)?.name || "Porcelain";
    
    return `<h1>Gạch Lát Sàn ${sizeText} ${color} ${surface} ${product.confirmAutoBarCode}</h1>
Tạo nên không gian sống hiện đại và sang trọng với mẫu <b>gạch lát sàn ${sizeText}</b> ${product.confirmAutoBarCode}. Sản phẩm được thiết kế với công nghệ tiên tiến, mang đến vẻ đẹp tinh tế và độ bền vượt trội cho mọi công trình.

<h2><b>Đặc Điểm Nổi Bật Của Gạch Lát Sàn ${sizeText}</b></h2>
<ul>
         <li><b>Chất Liệu ${material} Cao Cấp:</b> Được sản xuất từ nguyên liệu cao cấp, gạch có độ cứng cao, chống mài mòn tốt và khả năng chịu lực vượt trội, phù hợp cho các khu vực có lưu lượng đi lại cao.</li>
         <li><b>Bề Mặt ${surface} Tinh Tế:</b> Bề mặt ${surface.toLowerCase()} được xử lý công nghệ cao, tạo hiệu ứng ánh sáng tự nhiên và dễ dàng vệ sinh, giữ được vẻ đẹp lâu dài.</li>
         <li><b>Màu Sắc ${color} Hiện Đại:</b> Tông màu ${color.toLowerCase()} sang trọng, dễ dàng kết hợp với nhiều phong cách nội thất khác nhau, từ cổ điển đến hiện đại.</li>
         <li><b>Kích Thước ${sizeText} Linh Hoạt:</b> Kích thước ${sizeText} phù hợp cho nhiều không gian, từ phòng khách, phòng ngủ đến các khu vực thương mại.</li>
</ul>

<h2><strong>Thông Số Kỹ Thuật</strong></h2>
<p style="padding-left: 40px;">Trọng lượng: ${product.weightPerUnit} kg / Viên ~ ${product.weightPerBox} kg / Thùng
Độ hút nước: ${waterAbsorptionValue}
Chống trượt: ✅
Dùng lát nền: ✅
Dùng ốp tường: ${product.isWalling ? "✅" : "❌"}
Sử dụng trong nhà: ${product.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${product.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${product.isEdgeGrinding ? "✅" : "❌"}</p>

<h2><b>Ứng Dụng Lý Tưởng</b></h2>
Gạch lát sàn ${product.confirmAutoBarCode} phù hợp cho:
<ul>
         <li><b>Phòng khách:</b> Tạo không gian sang trọng và ấm cúng.</li>
         <li><b>Phòng ngủ:</b> Mang lại cảm giác thoải mái và thư giãn.</li>
         <li><b>Phòng bếp:</b> Dễ dàng vệ sinh và chống bám bẩn.</li>
         <li><b>Khu vực thương mại:</b> Văn phòng, showroom, khách sạn.</li>
</ul>

<p style="padding-left: 40px;">Công ty chịu trách nhiệm SP: CÔNG TY TNHH TẬP ĐOÀN THƯƠNG MẠI THÀNH CHUNG
Địa chỉ trụ sở: 427 TÔ HIẾN THÀNH, PHƯỜNG DIÊN HỒNG, TP. HỒ CHÍ MINH.</p>`;
  }
};

// Template cho gạch ốp tường
const wallTileTemplate: TechnicalInfoTemplate = {
  id: "wall",
  name: "Gạch Ốp Tường",
  patternIds: [],
  template: (product: ProductDetail, waterAbsorptionValue: string, sizeList: any[], colorList: any[], surfaceList: any[], materialList: any[]) => {
    const size = sizeList.find(x => x.id === product.actualSizeId);
    const sizeText = size ? `${Number(size.wide) / 10} x ${Number(size.length) / 10} cm` : "30x60";
    const color = colorList.find(x => x.id === product.colorId)?.name || "Trắng";
    const surface = surfaceList.find(x => x.id === product.surfaceFeatureId)?.name || "Mờ";
    const material = materialList.find(x => x.id === product.materialId)?.name || "Ceramic";
    
    return `<h1>Gạch Ốp Tường ${sizeText} ${color} ${surface} ${product.confirmAutoBarCode}</h1>
Tạo điểm nhấn ấn tượng cho không gian với mẫu <b>gạch ốp tường ${sizeText}</b> ${product.confirmAutoBarCode}. Sản phẩm kết hợp giữa thiết kế hiện đại và chất lượng cao cấp, mang đến vẻ đẹp hoàn hảo cho mọi bức tường.

<h2><b>Đặc Điểm Nổi Bật</b></h2>
<ul>
         <li><b>Thiết Kế ${color} Tinh Tế:</b> Màu sắc ${color.toLowerCase()} hài hòa, tạo cảm giác rộng rãi và thoáng đãng cho không gian.</li>
         <li><b>Bề Mặt ${surface} Chất Lượng:</b> Bề mặt ${surface.toLowerCase()} được xử lý công nghệ cao, dễ dàng vệ sinh và bảo quản.</li>
         <li><b>Chất Liệu ${material} Bền Bỉ:</b> Độ bền cao, chống ẩm mốc và dễ dàng lau chùi.</li>
         <li><b>Kích Thước ${sizeText} Linh Hoạt:</b> Phù hợp cho nhiều không gian khác nhau.</li>
</ul>

<h2><strong>Thông Số Kỹ Thuật</strong></h2>
<p style="padding-left: 40px;">Trọng lượng: ${product.weightPerUnit} kg / Viên ~ ${product.weightPerBox} kg / Thùng
Độ hút nước: ${waterAbsorptionValue}
Dùng ốp tường: ✅
Sử dụng trong nhà: ${product.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${product.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${product.isEdgeGrinding ? "✅" : "❌"}</p>

<h2><b>Ứng Dụng</b></h2>
<ul>
         <li><b>Phòng tắm:</b> Ốp tường, ốp vách.</li>
         <li><b>Phòng bếp:</b> Tường bếp, backsplash.</li>
         <li><b>Phòng khách:</b> Tường trang trí.</li>
         <li><b>Khu vực thương mại:</b> Văn phòng, nhà hàng.</li>
</ul>

<p style="padding-left: 40px;">Công ty chịu trách nhiệm SP: CÔNG TY TNHH TẬP ĐOÀN THƯƠNG MẠI THÀNH CHUNG
Địa chỉ trụ sở: 427 TÔ HIẾN THÀNH, PHƯỜNG DIÊN HỒNG, TP. HỒ CHÍ MINH.</p>`;
  }
};

// Template mặc định cho các pattern khác
const defaultTemplate: TechnicalInfoTemplate = {
  id: "default",
  name: "Template Mặc Định",
  patternIds: [],
  template: (
    product: ProductDetail,
    waterAbsorptionValue: string,
    sizeList: any[] = [],
    colorList: any[] = [],
    surfaceList: any[] = [],
    materialList: any[] = [],
    patternList: any[] = [],
    _bodyColorList: any[] = [],
    supplierName: string = ""
  ) => {
    const size = sizeList.find((x) => x.id === product.actualSizeId);
    const sizeText = size
      ? `${Number(size.wide) / 10} cm x ${Number(size.length) / 10} cm x ${product.thicknessSize} mm`
      : `${product.wideSize} cm x ${product.lengthSize} cm x ${product.thicknessSize} mm`;
    const color =
      colorList.find((x) => x.id === product.colorId)?.name || "";
    const surface =
      surfaceList.find((x) => x.id === product.surfaceFeatureId)?.name || "";
    const material = materialList.find((x) => x.id === product.materialId)?.name || "";
    const pattern =
      patternList.find((x) => x.id === product.brickPatternId)?.name ||
      product.brickPatternShortName ||
      "";
    const supplier = supplierName || "";
    const isAntiSlip = !(product.antiSlipId == 1 || product.antiSlipId == 14 || product.antiSlipId == 15);
    
    const description = product.otherNote ||  "";

    return `{Mã NCC: ${product.supplierItemCode}}
Barcode: ${product.autoBarCode}
Kích thước: ${sizeText}
{Nhà cung cấp: ${supplier}}
Bề mặt: ${surface}
Màu sắc: ${color}
Hệ Vân: ${pattern}
Chất liệu: ${material}
Đường dẫn/mô tả: ${description}

Trọng lượng: ${product.weightPerUnit} kg / Viên ~ ${product.weightPerBox} kg / Thùng
-----------------------------------------------------
M² / thùng: ${product.areaPerBox} m² / thùng
Chống trượt: ${isAntiSlip ? "✅" : "❌"}
Độ hút nước: ${waterAbsorptionValue}
Chống bám bẩn: ${product.isAntiFouling ? "✅" : "❌"}
Dùng lát nền: ${product.isFlooring ? "✅" : "❌"}
Dùng ốp tường: ${product.isWalling ? "✅" : "❌"}
Sử dụng trong nhà: ${product.isInside ? "✅" : "❌"}
Sử dụng ngoài trời: ${product.isOutside ? "✅" : "❌"}
Sản phẩm mài cạnh: ${product.isEdgeGrinding ? "✅" : "❌"}
`;
  }

//     return `Kích thước: ${sizeText}
// Barcode: ${product.autoBarCode}
// Bề mặt: ${surface}     ${supplier ? `` : ""}
// Màu sắc: ${color}
// Hệ Vân: ${pattern}
// Chất liệu: ${material}
// Trọng lượng: ${product.weightPerUnit} kg / Viên ~ ${product.weightPerBox} kg / Thùng
// -----------------------------------------------------
// M² / thùng: ${product.areaPerBox} m² / thùng
// Chống trượt: ${isAntiSlip ? "✅" : "❌"}
// Độ hút nước: ${waterAbsorptionValue}
// Chống bám bẩn: ${product.isAntiFouling ? "✅" : "❌"}
// Dùng lát nền: ${product.isFlooring ? "✅" : "❌"}
// Dùng ốp tường: ${product.isWalling ? "✅" : "❌"}
// Sử dụng trong nhà: ${product.isInside ? "✅" : "❌"}
// Sử dụng ngoài trời: ${product.isOutside ? "✅" : "❌"}
// Sản phẩm mài cạnh: ${product.isEdgeGrinding ? "✅" : "❌"}
// `;
//   }
};

// Danh sách tất cả templates
export const technicalInfoTemplates: TechnicalInfoTemplate[] = [
  artTemplate,
  floorTileTemplate,
  wallTileTemplate,
  defaultTemplate
];

// Hàm để lấy template phù hợp dựa trên pattern
export const getTechnicalInfoTemplate = (product: ProductDetail): TechnicalInfoTemplate => {
  product;
  /*// Tìm template dựa trên pattern ID hoặc tên pattern
  const patternId = product.brickPatternId;
  const patternName = product.brickPatternShortName || "";
  
  // Kiểm tra xem có phải pattern Art không (dựa trên tên)
  const isArtPattern = patternName.toLowerCase().includes('art') || 
                      patternName.toLowerCase().includes('nghệ thuật') ||
                      patternName.toLowerCase().includes('họa tiết');
  
  if (isArtPattern) {
    return technicalInfoTemplates.find(template => template.id === "art") || defaultTemplate;
  }
  
  // Kiểm tra loại sản phẩm (lát sàn hay ốp tường)
  if (product.isFlooring && !product.isWalling) {
    // Chỉ lát sàn
    return technicalInfoTemplates.find(template => template.id === "floor") || defaultTemplate;
  } else if (product.isWalling && !product.isFlooring) {
    // Chỉ ốp tường
    return technicalInfoTemplates.find(template => template.id === "wall") || defaultTemplate;
  }
  
  // Tìm template có patternIds chứa patternId hiện tại
  const template = technicalInfoTemplates.find(template => 
    template.patternIds.includes(patternId)
  );
  
  // Nếu không tìm thấy, trả về template mặc định
  // return template || defaultTemplate;*/
  return defaultTemplate; // Luôn trả về defaultTemplate nếu không tìm thấy template phù hợp
};

// Hàm để tạo technical info với template
export const generateTechnicalInfo = (
  product: ProductDetail, 
  waterAbsorptionValue: string,
  sizeList: any[] = [],
  colorList: any[] = [],
  surfaceList: any[] = [],
  materialList: any[] = [],
  patternList: any[] = [],
  bodyColorList: any[] = [],
  supplierName: string = ""
): string => {
  const template = getTechnicalInfoTemplate(product);
  return template.template(product, waterAbsorptionValue, sizeList, colorList, surfaceList, materialList, patternList, bodyColorList, supplierName);
}; 