import { IConnector } from "../../../controller/use_cases/IConnector.js";
import {
  ISnapshotRepository,
  NewSnapshot,
} from "../use_cases/ISnapshotRepository.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { ApiSnapshot, PrismaClient } from "@prisma/client";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";
import { Prisma } from "@prisma/client";

export default class PrismaSnapshotRepository implements ISnapshotRepository {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    this.connector = new PrismaConnector();
  }

  async add(model: NewSnapshot): Promise<ApiSnapshot> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      const record = await conn.apiSnapshot.create({ data: model });
      return record;
    } catch (e) {
      console.error("Repository:", e);
      throw e;
    } finally {
      if (conn) this.connector.releaseConnection(conn);
    }
  }

  async update(model: ApiSnapshot): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.apiSnapshot.update({
        where: {
          snapshot_id: model.snapshot_id,
        },
        data: model,
      });
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn) this.connector.releaseConnection(conn);
    }
  }

  async delete(model: ApiSnapshot): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.apiSnapshot.update({
        where: {
          snapshot_id: model.snapshot_id,
        },
        data: {
          active: false,
        },
      });
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async getBy(
    criteria: Partial<ApiSnapshot>,
    pageNumber: number,
  ): Promise<Search<ApiSnapshot>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      let dateFilter: Prisma.DateTimeFilter | undefined;

      if (criteria.snapshot_datetime) {
        const snapshotD = criteria.snapshot_datetime;

        // Define el inicio y el final del día especificado en snapshotD
        const startOfDay = new Date(
          Date.UTC(
            snapshotD.getUTCFullYear(),
            snapshotD.getUTCMonth(),
            snapshotD.getUTCDate(),
            0,
            0,
            0,
            0, // Inicio del día
          ),
        );

        const endOfDay = new Date(
          Date.UTC(
            snapshotD.getUTCFullYear(),
            snapshotD.getUTCMonth(),
            snapshotD.getUTCDate(),
            23,
            59,
            59,
            999, // Fin del día
          ),
        );

        dateFilter = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.apiSnapshot.count({
          where: {
            snapshot_version: criteria.snapshot_version
              ? { contains: criteria.snapshot_version }
              : undefined,
            snapshot_datetime: dateFilter,
            active: criteria.active,
            serial_number: criteria.serial_number
              ? { contains: criteria.serial_number }
              : undefined,
          },
        }),
        conn.apiSnapshot.findMany({
          where: {
            snapshot_version: criteria.snapshot_version
              ? { contains: criteria.snapshot_version }
              : undefined,
            snapshot_datetime: dateFilter,
            active: criteria.active,
            serial_number: criteria.serial_number
              ? { contains: criteria.serial_number }
              : undefined,
          },
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

  async get(id: number): Promise<ApiSnapshot | undefined> {
    let conn: PrismaClient | null = null;

    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const result = await conn.apiSnapshot.findFirst({
        where: {
          snapshot_id: id,
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

  async specificSearch(
    criteria: Partial<ApiSnapshot>,
    pageNumber: number,
  ): Promise<Search<ApiSnapshot>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.apiSnapshot.count({
          where: {
            snapshot_version: criteria.snapshot_version,
            snapshot_datetime: criteria.snapshot_datetime,
            active: criteria.active,
            serial_number: criteria.serial_number,
          },
        }),
        conn.apiSnapshot.findMany({
          where: {
            snapshot_version: criteria.snapshot_version,
            snapshot_datetime: criteria.snapshot_datetime,
            active: criteria.active,
            serial_number: criteria.serial_number,
          },
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
}
