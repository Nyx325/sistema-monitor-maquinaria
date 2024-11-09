import { Location, PrismaClient } from "@prisma/client";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";
import {
  ILocationRepository,
  NewLocation,
} from "../use_cases/ILocationRespository.js";

export class PrismaLocationRepo implements ILocationRepository {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    this.connector = new PrismaConnector();
  }

  async add(model: NewLocation): Promise<Location> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      const record = await conn.location.create({ data: model });
      return record;
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async update(model: Location): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.location.update({
        where: {
          location_id: model.location_id,
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

  async delete(model: Location): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.location.update({
        where: {
          location_id: model.location_id,
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
    criteria: Partial<Location>,
    pageNumber: number,
  ): Promise<Search<Location>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.location.count({
          where: {
            altitude: criteria.altitude,
            latitude: criteria.latitude,
            longitude: criteria.longitude,
            altitude_units: criteria.altitude_units
              ? { contains: criteria.altitude_units }
              : undefined,
            snapshot_id: criteria.snapshot_id,
            china_coordinate_id: criteria.china_coordinate_id,
            active: criteria.active,
          },
        }),
        conn.location.findMany({
          where: {
            altitude: criteria.altitude,
            latitude: criteria.latitude,
            longitude: criteria.longitude,
            altitude_units: criteria.altitude_units
              ? { contains: criteria.altitude_units }
              : undefined,
            snapshot_id: criteria.snapshot_id,
            china_coordinate_id: criteria.china_coordinate_id,
            active: criteria.active,
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

  public async get(id: number): Promise<Location | undefined> {
    let conn: PrismaClient | null = null;

    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const result = await conn.location.findFirst({
        where: {
          location_id: id,
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
    criteria: Partial<Location>,
    pageNumber: number,
  ): Promise<Search<Location>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.location.count({
          where: criteria,
        }),
        conn.location.findMany({
          where: criteria,
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
