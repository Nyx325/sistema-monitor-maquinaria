import { PrismaClient } from "@prisma/client";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { NewCOH } from "../../entities/NewCumulativeOperatingHours.js";
import { CumulativeOperatingHours } from "@prisma/client";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";
import { Repository } from "../use_cases/Repository.js";

export class PrismaCOHRepository extends Repository<
  CumulativeOperatingHours,
  NewCOH,
  number
> {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    super();
    this.connector = new PrismaConnector();
  }

  async add(model: NewCOH): Promise<CumulativeOperatingHours> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      const record = await conn.cumulativeOperatingHours.create({
        data: {
          active: true,
          hour: model.hour,
          date_time: model.date_time,
          snapshot_id: model.snapshot_id,
        },
      });
      return record;
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async update(model: CumulativeOperatingHours): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.cumulativeOperatingHours.update({
        where: {
          coh_id: model.coh_id,
        },
        data: model,
      });
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async delete(model: CumulativeOperatingHours): Promise<void> {
    model.active = false;
    return this.update(model);
  }

  async get(id: number): Promise<CumulativeOperatingHours | undefined> {
    let conn: PrismaClient | null = null;

    try {
      conn = await this.connector.getConnection();

      const result = await conn.cumulativeOperatingHours.findFirst({
        where: {
          coh_id: id,
        },
      });

      return result ?? undefined;
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async getBy(
    criteria: Partial<CumulativeOperatingHours>,
    pageNumber: number,
  ): Promise<Search<CumulativeOperatingHours>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      const dateFiler =
        criteria.date_time !== undefined
          ? this.getDateFilter(criteria.date_time)
          : undefined;

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.cumulativeOperatingHours.count({
          where: {
            snapshot_id: criteria.snapshot_id,
            active: criteria.active,
            hour: criteria.hour,
            date_time: dateFiler,
          },
        }),
        conn.cumulativeOperatingHours.findMany({
          where: {
            snapshot_id: criteria.snapshot_id,
            active: criteria.active,
            hour: criteria.hour,
            date_time: dateFiler,
          },
          orderBy: { date_time: "desc" },
          include: { snapshot: true },
          skip: (pageNumber - 1) * Config.instance.pageSize, // Skip previous pages
          take: Config.instance.pageSize, // Take only the results for the current page
        }),
      ]);

      const totalPages = Math.ceil(totalResults / Config.instance.pageSize);

      return {
        totalPages: totalPages,
        currentPage: pageNumber,
        criteria: criteria,
        result: results.length > 0 ? results : [],
      };
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async specificSearch(
    criteria: Partial<CumulativeOperatingHours>,
    pageNumber: number,
  ): Promise<Search<CumulativeOperatingHours>> {
    return this.getBy(criteria, pageNumber);
  }
}
