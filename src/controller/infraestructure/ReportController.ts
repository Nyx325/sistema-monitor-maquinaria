import { Request, Response } from "express";
import UserError from "../../model/entities/UserError.js";
import { PrismaClient } from "@prisma/client";
import Config from "../../config.js";
import { Search } from "../../model/entities/Search.js";

type AvgResult = { avg: number | null };
type ReportData = {
  startDate: string;
  endDate: string;
  daysDifference: number;
};

export class ReportController {
  protected prisma: PrismaClient;
  protected cfg: Config = Config.instance;

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
    return this.execute(req, res, this.performReport2.bind(this));
  }

  public reporte3(req: Request, res: Response) {
    return this.execute(req, res, this.performReport3.bind(this));
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
        daysDifference !== undefined
          ? parseInt(`${daysDifference}`)
          : undefined,
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
        msg.push(
          "la diferencia de dias entre muestras debe ser un numero entero mayor a 0",
        );
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

    // Devolver los promedios por intervalo junto con las fechas
    res.status(200).json({
      generalAvg: {
        coh: Number(coh[0].avg),
        fuelUsed: Number(fuelUsed[0].avg),
        distance: Number(distance[0].avg),
        cih: Number(cih[0].avg),
        fuelRemaining: Number(fuelRemaining[0].avg),
        defRemaining: Number(defRemaining[0].avg),
      },
      rangedAvg: results,
    });
  }

  async performReport2(req: Request, res: Response) {
    const { serialNumber = "", page = "1" } = req.query;

    // Convertir page y pageSize a números enteros
    const pageParse = parseInt(page as string, 10);
    const currentPage = isNaN(pageParse) ? 1 : pageParse;

    const size = this.cfg.pageSize;
    const offset = (currentPage - 1) * size;

    // Consulta principal con paginación
    const rows = await this.prisma.$queryRaw`
      SELECT 
          Equipement.serial_number,
          ROUND(COALESCE(SUM(CumulativeIdleHours.hour), 0), 4) AS horasInactivas,
          ROUND(COALESCE(SUM(CumulativeOperatingHours.hour), 0), 4) AS horasOperativas,
          ROUND(
              COALESCE(SUM(CumulativeIdleHours.hour), 0) / 
              (COALESCE(SUM(CumulativeIdleHours.hour), 0) + COALESCE(SUM(CumulativeOperatingHours.hour), 0)), 
              4
          ) AS proporcionInactiva
      FROM 
          Equipement
      INNER JOIN 
          ApiSnapshot ON Equipement.serial_number = ApiSnapshot.serial_number
      LEFT JOIN 
          CumulativeIdleHours ON ApiSnapshot.snapshot_id = CumulativeIdleHours.snapshot_id
      LEFT JOIN 
          CumulativeOperatingHours ON ApiSnapshot.snapshot_id = CumulativeOperatingHours.snapshot_id
      WHERE 
          Equipement.serial_number LIKE ${`%${serialNumber}%`} AND
          ApiSnapshot.snapshot_datetime BETWEEN '2024-01-01 00:00:00' AND '2025-01-31 23:59:59'
      GROUP BY 
          Equipement.serial_number
      LIMIT ${size} OFFSET ${offset};
    `;

    // Consulta para contar el total de filas (sin paginación)
    const totalRows = await this.prisma.$queryRaw<{ total: bigint }[]>`
      SELECT 
          COUNT(DISTINCT Equipement.serial_number) AS total
      FROM 
          Equipement
      INNER JOIN 
          ApiSnapshot ON Equipement.serial_number = ApiSnapshot.serial_number
      LEFT JOIN 
          CumulativeIdleHours ON ApiSnapshot.snapshot_id = CumulativeIdleHours.snapshot_id
      LEFT JOIN 
          CumulativeOperatingHours ON ApiSnapshot.snapshot_id = CumulativeOperatingHours.snapshot_id
      WHERE 
          Equipement.serial_number LIKE ${`%${serialNumber}%`} AND
          ApiSnapshot.snapshot_datetime BETWEEN '2024-01-01 00:00:00' AND '2025-01-31 23:59:59';
    `;

    // Convertir BigInt a number (puede causar pérdida de precisión si el número es muy grande)
    const total = Number(totalRows[0]?.total || 0);
    const totalPages = Math.ceil(total / size);

    const result: Search<unknown> = {
      result: [rows],
      totalPages,
      currentPage,
      criteria: {
        serialNumber,
      },
    };

    // Respuesta con la información de paginación
    res.status(200).json(result);
  }

  // hora = Combustible usado total / Horas operativas acumulada
  async performReport3(req: Request, res: Response) {
    const { serialNumber = "", page = "1" } = req.query;

    // Convertir page y pageSize a números enteros
    const pageParse = parseInt(page as string, 10);
    const currentPage = isNaN(pageParse) ? 1 : pageParse;

    const size = this.cfg.pageSize;
    const offset = (currentPage - 1) * size;
    const rows = await this.prisma.$queryRaw`
      WITH LatestFuelUsed AS (
          SELECT 
              s.serial_number,
              f.fuel_consumed,
              f.date_time
          FROM FuelUsed f
          JOIN ApiSnapshot s ON f.snapshot_id = s.snapshot_id
          WHERE 
          f.date_time = (
              SELECT MAX(f2.date_time)
              FROM FuelUsed f2
              JOIN ApiSnapshot s2 ON f2.snapshot_id = s2.snapshot_id
              WHERE s2.serial_number = s.serial_number
          )
      ),
      LatestCumulativeHours AS (
          SELECT 
              s.serial_number,
              c.hour,
              c.date_time
          FROM CumulativeOperatingHours c
          JOIN ApiSnapshot s ON c.snapshot_id = s.snapshot_id
          WHERE 
          c.date_time = (
              SELECT MAX(c2.date_time)
              FROM CumulativeOperatingHours c2
              JOIN ApiSnapshot s2 ON c2.snapshot_id = s2.snapshot_id
              WHERE s2.serial_number = s.serial_number
          )
      )
      SELECT 
          f.serial_number AS equipo,
          f.fuel_consumed AS combustible_usado_acumulado,
          c.hour AS horas_operativas_acumuladas,
          ROUND(IF(c.hour > 0, f.fuel_consumed / c.hour, NULL), 4) AS combustible_por_hora
      FROM LatestFuelUsed f
      JOIN LatestCumulativeHours c ON f.serial_number = c.serial_number
      WHERE f.serial_number LIKE ${`%${serialNumber}%`}
      GROUP BY f.serial_number
      ORDER BY f.serial_number
      LIMIT ${size} OFFSET ${offset};
    `;

    const totalRows = await this.prisma.$queryRaw<{ total: bigint }[]>`
      WITH LatestFuelUsed AS (
          SELECT 
              s.serial_number,
              f.fuel_consumed,
              f.date_time
          FROM FuelUsed f
          JOIN ApiSnapshot s ON f.snapshot_id = s.snapshot_id
          WHERE 
          f.date_time = (
              SELECT MAX(f2.date_time)
              FROM FuelUsed f2
              JOIN ApiSnapshot s2 ON f2.snapshot_id = s2.snapshot_id
              WHERE s2.serial_number = s.serial_number
          )
      ),
      LatestCumulativeHours AS (
          SELECT 
              s.serial_number,
              c.hour,
              c.date_time
          FROM CumulativeOperatingHours c
          JOIN ApiSnapshot s ON c.snapshot_id = s.snapshot_id
          WHERE 
          c.date_time = (
              SELECT MAX(c2.date_time)
              FROM CumulativeOperatingHours c2
              JOIN ApiSnapshot s2 ON c2.snapshot_id = s2.snapshot_id
              WHERE s2.serial_number = s.serial_number
          )
      )
      SELECT COUNT(*) AS total
      FROM (
          SELECT 
              f.serial_number AS equipo
          FROM LatestFuelUsed f
          JOIN LatestCumulativeHours c ON f.serial_number = c.serial_number
      WHERE f.serial_number LIKE ${`%${serialNumber}%`}
          GROUP BY f.serial_number
      ) AS subquery;
    `;

    // Convertir BigInt a number (puede causar pérdida de precisión si el número es muy grande)
    const total = Number(totalRows[0]?.total || 0);
    const totalPages = Math.ceil(total / size);

    const result: Search<unknown> = {
      result: [rows],
      totalPages,
      currentPage,
      criteria: {
        serialNumber,
      },
    };

    // Respuesta con la información de paginación
    res.status(200).json(result);
  }
}
