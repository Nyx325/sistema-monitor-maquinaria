import { Chart } from "chart.js";

class ReportAdapter {
  protected apiUrl: string;

  constructor() {
    this.apiUrl = `${document.location.host}/api`;
  }

  async getData(startDate: string, endDate: string, daysDifference: number) {
    const response = await fetch(
      `http://${this.apiUrl}/reportes/1?startDate=${startDate}&endDate=${endDate}&daysDifference=${daysDifference}`,
    );

    const resParsed = await response.json(); // Solo trabajamos con rangedAvg

    if (response.status >= 400) throw Error(resParsed.message);

    const {
      rangedAvg,
      generalAvg,
    }: {
      generalAvg: {
        coh: number;
        fuelUsed: number;
        distance: number;
        cih: number;
        fuelRemaining: number;
        defRemaining: number;
      };
      rangedAvg: Array<{
        dateRange: string;
        cohAvg: number;
        fuelUsedAvg: number;
        odometerAvg: number;
        idleHoursAverage: number;
        fuelRemainingAverage: number;
        defRemainingAverage: number;
      }>;
    } = resParsed;

    const labels = rangedAvg.map((item) => item.dateRange);
    const cohAvgData = rangedAvg.map((item) => item.cohAvg);
    const fuelUsedAvgData = rangedAvg.map((item) => item.fuelUsedAvg);
    const odometerAvgData = rangedAvg.map((item) => item.odometerAvg);
    const idleHoursAverageData = rangedAvg.map((item) => item.idleHoursAverage);
    const fuelRemainingAverageData = rangedAvg.map(
      (item) => item.fuelRemainingAverage,
    );
    const defRemainingAverageData = rangedAvg.map(
      (item) => item.defRemainingAverage,
    );

    return {
      generalAvg,
      charts: [
        {
          chartId: "cohAvgChart",
          title: "Horas operativas acumuladas",
          data: {
            labels,
            datasets: [
              {
                label: "Horas operativas acumuladas",
                data: cohAvgData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
              },
            ],
          },
        },
        {
          chartId: "fuelUsedChart",
          title: "Combustible usado",
          data: {
            labels,
            datasets: [
              {
                label: "Combustible usado",
                data: fuelUsedAvgData,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
              },
            ],
          },
        },
        {
          chartId: "odometerChart",
          title: "Odómetro",
          data: {
            labels,
            datasets: [
              {
                label: "Odómetro",
                data: odometerAvgData,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          },
        },
        {
          chartId: "idleHoursChart",
          title: "Horas inactivas acumuladas",
          data: {
            labels,
            datasets: [
              {
                label: "Horas inactivas acumuladas",
                data: idleHoursAverageData,
                borderColor: "rgba(153, 102, 255, 1)",
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                fill: true,
              },
            ],
          },
        },
        {
          chartId: "fuelRemainingChart",
          title: "Combustible restante",
          data: {
            labels,
            datasets: [
              {
                label: "Combustible restante",
                data: fuelRemainingAverageData,
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                fill: true,
              },
            ],
          },
        },
        {
          chartId: "defRemainingChart",
          title: "DEF Restante",
          data: {
            labels,
            datasets: [
              {
                label: "DEF Restante",
                data: defRemainingAverageData,
                borderColor: "rgba(255, 205, 86, 1)",
                backgroundColor: "rgba(255, 205, 86, 0.2)",
                fill: true,
              },
            ],
          },
        },
      ],
    };
  }
}

function translateKey(key: string) {
  const translate: { [key: string]: string } = {
    coh: "Horas operativas acumuladas",
    fuelUsed: "Combustible usado",
    distance: "Valor odómetro",
    cih: "Horas inactivas acumuladas",
    fuelRemaining: "Combustible resntante",
    defRemaining: "DEF restante",
  };

  return translate[key] ?? "Campo desconocido";
}

document.addEventListener("DOMContentLoaded", () => {
  const startDayI = document.getElementById("start-date") as HTMLInputElement;
  const endDayI = document.getElementById("end-date") as HTMLInputElement;
  const daysDifferenceI = document.getElementById(
    "days-difference",
  ) as HTMLInputElement;
  const summitBtn = document.getElementById("summit-btn") as HTMLButtonElement;
  const table = document.getElementById("general-avg") as HTMLTableElement;
  const alert = document.getElementById("alert") as HTMLElement;
  const reportAdapter = new ReportAdapter();

  summitBtn.addEventListener("click", () => {
    const start = startDayI.value.trim();
    const end = endDayI.value.trim();
    const days = daysDifferenceI.value.trim();

    reportAdapter
      .getData(start, end, Number(days))
      .then((chartsData) => {
        const container = document.getElementById(
          "charts-container",
        ) as HTMLElement;

        // Limpiar gráficos anteriores
        container.innerHTML = "";

        // Crear un encabezado y agregarlo al contenedor
        const header = document.createElement("h1");
        header.textContent = "Promedios por marca de tiempo"; // Establecer el texto del encabezado
        container.appendChild(header);

        const { charts, generalAvg } = chartsData;

        table.innerHTML = "";
        table.className = "table table-striped";

        // Crear encabezado
        const thead = document.createElement("thead");
        thead.innerHTML = `
          <tr>
            <th>Concepto</th>
            <th>Promedio General</th>
          </tr>`;
        table.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement("tbody");
        Object.entries(generalAvg).forEach(([key, value]) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${translateKey(key)}</td>
            <td>${value.toFixed(2)}</td>`;
          tbody.appendChild(row);
        });
        table.appendChild(tbody);

        charts.forEach(({ chartId, title, data }) => {
          // Crear un nuevo canvas
          const canvas = document.createElement("canvas");
          canvas.id = chartId;
          canvas.style.marginBottom = "20px";
          container.appendChild(canvas);

          // Crear el gráfico
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          new Chart(ctx, {
            type: "line",
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: title,
                },
              },
              scales: {
                x: {
                  ticks: {
                    callback: (value) => data.labels[value as number],
                    maxRotation: 90,
                    minRotation: 90,
                  },
                },
              },
            },
          });
        });
        alert.classList.add("d-none");
      })
      .catch((e) => {
        console.error(e);
        alert.innerHTML = e.message;
        alert.classList.remove("d-none");
      });
  });
});
