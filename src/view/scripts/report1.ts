import { Chart } from "chart.js";
import { AverageData } from "../../model/entities/AverageData.js";
import Utils from "./config.js";

class ReportAdapter {
  protected endpoint: string;
  protected utils: Utils;
  protected url: string;

  constructor() {
    this.utils = Utils.instance; // Permite inyectar dependencias para pruebas.
    this.endpoint = "reportes";
    this.url = `${this.utils.apiUrl}/${this.endpoint}`;
  }

  async getData(startDate: string, endDate: string, daysDifference: number) {
    const response = await fetch(
      `${this.url}/reporte1?startDate=${startDate}&endDate=${endDate}&daysDifference=${daysDifference}`
    );

    const parseRes = await response.json();

    if (response.status >= 400) throw Error(parseRes.message);

    const data = parseRes as AverageData[];

    const labels = data.map((item) => item.dateRange); // Usamos el rango de fechas como etiquetas
    const cohAvgData = data.map((item) => item.cohAvg);
    const fuelUsedAvgData = data.map((item) => item.fuelUsedAvg);
    const odometerAvgData = data.map((item) => item.odometerAvg);
    const idleHoursAverageData = data.map((item) => item.idleHoursAverage);
    const fuelRemainingAverageData = data.map(
      (item) => item.fuelRemainingAverage
    );
    const defRemainingAverageData = data.map(
      (item) => item.defRemainingAverage
    );

    return {
      labels,
      datasets: [
        {
          label: "Cumulative Operating Hours (cohAvg)",
          data: cohAvgData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
        {
          label: "Fuel Used (fuelUsedAvg)",
          data: fuelUsedAvgData,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
        {
          label: "Odometer (odometerAvg)",
          data: odometerAvgData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
        {
          label: "Idle Hours (idleHoursAverage)",
          data: idleHoursAverageData,
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: true,
        },
        {
          label: "Fuel Remaining (fuelRemainingAverage)",
          data: fuelRemainingAverageData,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: true,
        },
        {
          label: "DEF Remaining (defRemainingAverage)",
          data: defRemainingAverageData,
          borderColor: "rgba(255, 205, 86, 1)",
          backgroundColor: "rgba(255, 205, 86, 0.2)",
          fill: true,
        },
      ],
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const startDayI = document.getElementById("start-date") as HTMLInputElement;
  const endDayI = document.getElementById("end-date") as HTMLInputElement;
  const daysDifferenceI = document.getElementById(
    "days-difference"
  ) as HTMLInputElement;
  const summitBtn = document.getElementById("summit-btn") as HTMLButtonElement;
  const reportAdapter = new ReportAdapter();

  summitBtn.addEventListener("click", () => {
    const start = startDayI.value.trim();
    const end = endDayI.value.trim();
    const days = daysDifferenceI.value.trim();

    reportAdapter.getData(start, end, Number(days)).then((chartData) => {
      const ctx = document.getElementById("myChart") as HTMLCanvasElement;

      new Chart(ctx, {
        type: "line", // Tipo de gráfico
        data: chartData, // Los datos del gráfico
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    });
  });
});
