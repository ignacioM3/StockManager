import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

interface MonthlySale {
  month: string;
  total: number;
}

interface Props {
  data: MonthlySale[];
}

export function SalesMonthlyChart({ data }: Props) {

  const chartData = useMemo(() => ({
    labels: data.map(d => d.month),
    datasets: [
      {
        label: "Ventas por mes",
        data: data.map(d => d.total),
        backgroundColor: "#f97316", // naranja coherente con tu sistema
        borderRadius: 6,
      }
    ]
  }), [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-[#f3ead0]">
      <h3 className="text-lg font-semibold mb-4">
        Ventas por mes
      </h3>

      <Bar data={chartData} options={options} />
    </div>
  );
}