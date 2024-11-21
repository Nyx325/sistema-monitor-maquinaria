import { Request, Response } from "express";
import UserError from "../../model/entities/UserError.js";
import { PrismaClient } from "@prisma/client";

type AvgResult = { avg: number | null };
type ReportData = {
  startDate: string;
  endDate: string;
  daysDifference: number;
};

export class ReportController {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  protected handleError(e: unknown, res: Response) {
    if (e instanceof UserError) {
      res.status(400).json({ message: e.message });
    } else {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private async execute<T>(
    req: Request,
    res: Response,
    action: (req: Request, res: Response) => Promise<T>,
  ): Promise<void> {
    // Cambiado para reflejar el retorno en caso de error
    try {
      await action(req, res);
    } catch (error) {
      this.handleError(error, res);
      return undefined; // O vuelve a lanzar el error si es necesario
    }
  }

  public reporte1(req: Request, res: Response) {
    return this.execute(req, res, this.performReport1.bind(this));
  }

  public reporte2(req: Request, res: Response) {
    return this.execute(req, res, this.performReport1);
  }

  public reporte3(req: Request, res: Response) {
    return this.execute(req, res, this.performReport1);
  }

  public reporte4(req: Request, res: Response) {
    return this.execute(req, res, this.performReport1);
  }

  public reporte5(req: Request, res: Response) {
    return this.execute(req, res, this.performReport1);
  }

  private async performReport1(req: Request, res: Response) {
    const { startDate, endDate, daysDifference } = req.query;

    const msg = [];

    const params: Partial<ReportData> = {
      startDate: startDate !== undefined ? `${startDate}` : undefined,
      endDate: endDate !== undefined ? `${endDate}` : undefined,
      daysDifference:
        daysDifference !== undefined ? Number(daysDifference) : undefined,
    };

    const keys = Object.keys(params) as Array<keyof ReportData>;
    for (const key of keys) {
      if (params[key] === undefined) {
        msg.push(`${key} no fue definido`);
        continue;
      }

      if (typeof params[key] === "string" && isNaN(Date.parse(params[key]))) {
        msg.push("formato de fecha y hora inválidos");
        continue;
      }

      if (typeof params[key] === "number" && params[key] <= 0)
        msg.push("la diferencia de dias entre muestras debe ser mayor a 0");
    }

    if (msg.length !== 0) throw new UserError(msg.join(", "));

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const difference = parseInt(daysDifference as string, 10);

    // Generar los intervalos de fechas
    const intervals: { start: Date; end: Date }[] = [];
    let currentStart = new Date(start);
    let currentEnd = new Date(
      currentStart.getTime() + difference * 24 * 60 * 60 * 1000,
    );

    while (currentEnd <= end) {
      intervals.push({
        start: new Date(currentStart),
        end: new Date(currentEnd),
      });

      currentStart = new Date(currentEnd.getTime() + 1); // +1 día después del intervalo
      currentEnd = new Date(
        currentStart.getTime() + difference * 24 * 60 * 60 * 1000,
      ); // siguiente intervalo
    }

    // Consultar los promedios para cada intervalo
    const results = await Promise.all(
      intervals.map(async ({ start, end }) => {
        const [coh, fuelUsed, distance, cih, fuelRemaining, defRemaining] =
          await Promise.all([
            this.prisma.$queryRaw<
              AvgResult[]
            >`SELECT ROUND(AVG(hour), 4) AS avg FROM CumulativeOperatingHours WHERE date_time >= ${start.toISOString()} AND date_time <= ${end.toISOString()}`,
            this.prisma.$queryRaw<
              AvgResult[]
            >`SELECT ROUND(AVG(fuel_consumed), 4) AS avg FROM FuelUsed WHERE date_time >= ${start.toISOString()} AND date_time <= ${end.toISOString()}`,
            this.prisma.$queryRaw<
              AvgResult[]
            >`SELECT ROUND(AVG(odometer), 4) AS avg FROM Distance WHERE date_time >= ${start.toISOString()} AND date_time <= ${end.toISOString()}`,
            this.prisma.$queryRaw<
              AvgResult[]
            >`SELECT ROUND(AVG(hour), 4) AS avg FROM CumulativeIdleHours WHERE date_time >= ${start.toISOString()} AND date_time <= ${end.toISOString()}`,
            this.prisma.$queryRaw<
              AvgResult[]
            >`SELECT ROUND(AVG(percent), 4) AS avg FROM FuelRemaining WHERE date_time >= ${start.toISOString()} AND date_time <= ${end.toISOString()}`,
            this.prisma.$queryRaw<
              AvgResult[]
            >`SELECT ROUND(AVG(percent), 4) AS avg FROM DefRemaining WHERE date_time >= ${start.toISOString()} AND date_time <= ${end.toISOString()}`,
          ]);

        // Si el valor es null, lo reemplazamos por 0
        return {
          dateRange: `${start.toISOString().split("T")[0]} - ${end.toISOString().split("T")[0]}`, // Formato de fecha de inicio y fin
          cohAvg: coh[0]?.avg ?? 0,
          fuelUsedAvg: fuelUsed[0]?.avg ?? 0,
          odometerAvg: distance[0]?.avg ?? 0,
          idleHoursAverage: cih[0]?.avg ?? 0,
          fuelRemainingAverage: fuelRemaining[0]?.avg ?? 0,
          defRemainingAverage: defRemaining[0]?.avg ?? 0,
        };
      }),
    );

    // Devolver los promedios por intervalo junto con las fechas
    res.status(200).json(results);
  }
}
