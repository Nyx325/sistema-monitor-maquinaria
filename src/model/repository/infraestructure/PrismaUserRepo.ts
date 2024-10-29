import { PrismaClient } from "@prisma/client/extension";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { UserRepository } from "../use_cases/UserRepository.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { User } from "@prisma/client";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaUserRepo implements UserRepository {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    this.connector = new PrismaConnector();
  }

  async add(model: User): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.user.create({ data: model });
    } catch (error) {
      console.error(`Repository: ${error}`);
      throw error;
    } finally {
      if (conn !== null) this.connector.releaseConnection(conn);
    }
  }

  async delete(model: User): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.user.update({
        where: {
          user_id: model.user_id,
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

  async update(model: User): Promise<void> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();
      await conn.user.update({
        where: {
          user_id: model.user_id,
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

  async get(id: number): Promise<User | undefined> {
    let conn: PrismaClient | null = null;

    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const result = await conn.user.findFirst({
        where: {
          user_id: id,
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
    criteria: Partial<User>,
    pageNumber: number,
  ): Promise<Search<User>> {
    let conn: PrismaClient | null = null;
    try {
      conn = await this.connector.getConnection();

      // Ejecutar las consultas de forma concurrente si no dependen entre sí
      const [totalResults, results] = await Promise.all([
        conn.equipement.count({
          where: {
            full_name: criteria.full_name
              ? { contains: criteria.full_name }
              : undefined,
            user_name: criteria.user_name
              ? { contains: criteria.user_name }
              : undefined,
            user_type: criteria.user_type,
            active: criteria.active,
            email: criteria.email,
          },
        }),
        conn.equipement.findMany({
          where: {
            full_name: criteria.full_name
              ? { contains: criteria.full_name }
              : undefined,
            user_name: criteria.user_name
              ? { contains: criteria.user_name }
              : undefined,
            user_type: criteria.user_type,
            active: criteria.active,
            email: criteria.email,
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

  async specificSearch(
    criteria: Partial<User>,
    pageNumber: number,
  ): Promise<Search<User>> {
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
