import { Equipement, PrismaClient } from "@prisma/client";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { EquipementRepository } from "../use_cases/EquipementRepository.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaEquipementRepo implements EquipementRepository {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    this.connector = new PrismaConnector();
  }

  async add(model: Equipement): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.equipement.create({ data: model });
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async update(model: Equipement): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.equipement.update({
        where: {
          serial_number: model.serial_number,
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

  async delete(model: Equipement): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.equipement.update({
        where: {
          serial_number: model.serial_number,
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
    criteria: Partial<Equipement>,
    pageNumber: number,
  ): Promise<Search<Equipement>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.equipement.count({
          where: {
            serial_number: criteria.serial_number
              ? { contains: criteria.serial_number }
              : undefined,
            oem_name: criteria.oem_name
              ? { contains: criteria.oem_name }
              : undefined,
            model: criteria.model ? { contains: criteria.model } : undefined,
            active: criteria.active,
          },
        }),
        conn.equipement.findMany({
          where: {
            serial_number: criteria.serial_number
              ? { contains: criteria.serial_number }
              : undefined,
            oem_name: criteria.oem_name
              ? { contains: criteria.oem_name }
              : undefined,
            model: criteria.model ? { contains: criteria.model } : undefined,
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

  async get(id: string): Promise<Equipement | undefined> {
    let conn: PrismaClient | null = null;

    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const result = await conn.equipement.findFirst({
        where: {
          serial_number: id,
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
    criteria: Partial<Equipement>,
    pageNumber: number,
  ): Promise<Search<Equipement>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.equipement.count({
          where: criteria,
        }),
        conn.equipement.findMany({
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
