import { Equipement, PrismaClient } from "@prisma/client";
import { IConnector } from "../../common/controller/IConnector";
import { EquipementRepository } from "./EquipementRepository";
import { PrismaConnector } from "../../common/controller/PrismaConnector";
import { Search } from "../../common/model/Search";

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
      console.error(error);
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
      console.error(error);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async permanentlyDeletion(model: Equipement): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.equipement.delete({
        where: {
          serial_number: model.serial_number,
        },
      });
    } catch (error) {
      console.error(error);
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
    const pageSize = 10;

    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.equipement.count({
          where: criteria,
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
            equipement_id: criteria.equipement_id
              ? { equals: criteria.equipement_id }
              : undefined,
          },
        }),
      ]);

      const totalPages = Math.ceil(totalResults / pageSize);

      return {
        totalPages: totalPages,
        currentPage: pageNumber,
        criteria: criteria,
        result: results.length > 0 ? results : [],
      };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }
}
