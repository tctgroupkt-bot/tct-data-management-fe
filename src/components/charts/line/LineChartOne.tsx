import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { UploadWebsiteStatus } from "../../../app/models/product/enum/product.enum";
import { ProductStatisticsResponse } from "../../../app/models/product/product.model";

export default observer(function LineChartOne() {
  const { productStore } = useStore();
  const [statisticsData, setStatisticsData] =
    useState<ProductStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    loadStatisticsData();
  }, []);

  // Tạo dữ liệu mẫu cho daily
  const generateMockDailyData = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(i + 1).padStart(2, "0")}`,
      count: Math.floor(Math.random() * 20) + 5, // Random số từ 5-25
      uploadStatus: typeof UploadWebsiteStatus.Completed,
    }));
  };

  // Tạo dữ liệu mẫu cho monthly
  const generateMockMonthlyData = () => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 12 }, (_, i) => ({
      date: `${currentYear}-${String(i + 1).padStart(2, "0")}-01`,
      count: Math.floor(Math.random() * 200) + 50, // Random số từ 50-250
      uploadStatus: UploadWebsiteStatus.Completed,
    }));
  };

  const loadStatisticsData = async () => {
    setLoading(true);
    try {
      // Lấy dữ liệu cho năm hiện tại
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      const data = await productStore.getProductStatistics(
        startDate,
        endDate,
        UploadWebsiteStatus.Completed // Chỉ lấy sản phẩm có uploadStatus là "đã đăng"
      );

      if (data) {
        setStatisticsData(data);
      } else {
        // Sử dụng dữ liệu mẫu nếu API chưa có
        const mockData: ProductStatisticsResponse = {
          // @ts-ignore
          dailyData: generateMockDailyData(),
          monthlyData: generateMockMonthlyData(),
          totalUploaded: 1250,
          totalProducts: 2000,
        };
        setStatisticsData(mockData);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
      // Sử dụng dữ liệu mẫu nếu có lỗi
      const mockData: ProductStatisticsResponse = {
        // @ts-ignore
        dailyData: generateMockDailyData(),
        monthlyData: generateMockMonthlyData(),
        totalUploaded: 1250,
        totalProducts: 2000,
      };
      setStatisticsData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Tạo dữ liệu cho chart
  const generateChartData = () => {
    if (!statisticsData) {
      return {
        categories: [],
        series: [],
      };
    }

    if (viewMode === "daily") {
      // Dữ liệu theo ngày trong tháng hiện tại
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      const categories = Array.from(
        { length: daysInMonth },
        (_, i) => `${i + 1}`
      );
      const dailyData = Array(daysInMonth).fill(0);

      // Lọc dữ liệu theo tháng hiện tại
      statisticsData.dailyData.forEach((item) => {
        const itemDate = new Date(item.date);
        if (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        ) {
          const day = itemDate.getDate() - 1; // Array index starts from 0
          dailyData[day] = item.count;
        }
      });

      return {
        categories,
        series: [
          {
            name: "Sản phẩm đã đăng",
            data: dailyData,
          },
        ],
      };
    } else {
      // Dữ liệu theo tháng trong năm
      const months = [
        "T1",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "T8",
        "T9",
        "T10",
        "T11",
        "T12",
      ];

      const monthlyData = Array(12).fill(0);

      statisticsData.monthlyData.forEach((item) => {
        const itemDate = new Date(item.date);
        const month = itemDate.getMonth();
        monthlyData[month] = item.count;
      });

      return {
        categories: months,
        series: [
          {
            name: "Sản phẩm đã đăng",
            data: monthlyData,
          },
        ],
      };
    }
  };

  const chartData = generateChartData();

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"], // Màu xanh cho sản phẩm đã đăng
    chart: {
      fontFamily: "Roboto, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth", // Đường cong mượt mà
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        formatter: (val: number) => {
          if (viewMode === 'daily') {
            return `Ngày ${val}`;
          }
          return val.toString();
        },
      },
      y: {
        formatter: (val: number) => `${val} sản phẩm`,
      },
    },
    xaxis: {
      type: "category",
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "Số lượng sản phẩm",
        style: {
          fontSize: "14px",
          color: "#6B7280",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] flex items-center justify-center h-[310px]">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Thống kê sản phẩm đã đăng
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("daily")}
                className={`px-3 py-1 rounded-md text-sm font-bold ${
                  viewMode === "daily"
                    ? "bg-[#334355] text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                Theo ngày
              </button>
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-3 py-1 rounded-md text-sm font-bold ${
                  viewMode === "monthly"
                    ? "bg-[#334355] text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                Theo tháng
              </button>
            </div>
          </div>
          <div id="chartEight" className="min-w-[1000px]">
            <Chart
              options={options}
              series={chartData.series}
              type="area"
              height={310}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
