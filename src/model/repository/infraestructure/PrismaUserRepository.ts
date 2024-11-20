import { PrismaClient, User } from "@prisma/client";
import { Repository } from "../use_cases/Repository.js";
import { NewUser } from "../use_cases/UserRepository.js";
import { IConnector } from "../../../controller/use_cases/IConnector.js";
import { PrismaConnector } from "../../../controller/infraestructure/PrismaConnector.js";
import { Search } from "../../entities/Search.js";
import Config from "../../../config.js";

export class PrismaUserRepository extends Repository<User, NewUser, number> {
  private readonly connector: IConnector<PrismaClient>;

  constructor() {
    super();
    this.connector = new PrismaConnector();
  }

  private async executeWithConnection<T>(
    action: (conn: PrismaClient) => Promise<T>,
  ): Promise<T> {
    {
      let conn: PrismaClient | null = null;
      try {
        conn = await this.connector.getConnection();
        return await action(conn);
      } catch (error) {
        console.error(`Repository: ${error}`);
        throw error;
      } finally {
        if (conn !== null) this.connector.releaseConnection(conn);
      }
    }
  }

  async add(model: NewUser): Promise<User> {
    return this.executeWithConnection((conn) =>
      conn.user.create({ data: model }),
    );
  }

  async update(model: User): Promise<void> {
    await this.executeWithConnection((conn) =>
      conn.user.update({
        where: { user_id: model.user_id },
        data: model,
      }),
    );
  }

  async delete(model: User): Promise<void> {
    model.active = false;
    await this.update(model);
  }

  async get(id: number): Promise<User | undefined> {
    return this.executeWithConnection(async (conn) => {
      const result = await conn.user.findFirst({
        where: { user_id: id },
      });
      return result ?? undefined;
    });
  }

  async getBy(
    criteria: Partial<User>,
    pageNumber: number,
  ): Promise<Search<User>> {
    return this.executeWithConnection(async (conn) => {
      const where = {
        active: criteria.active,
        email: criteria.email,
        full_name:
          criteria.full_name !== undefined
            ? { contains: criteria.full_name }
            : undefined,
        user_name:
          criteria.user_name !== undefined
            ? { contains: criteria.user_name }
            : undefined,
        user_type: criteria.user_type,
      };

      const [totalResults, results] = await Promise.all([
        conn.user.count({
          where,
        }),
        conn.user.findMany({
          where,
          orderBy: { user_name: "desc" },
          skip: (pageNumber - 1) * Config.instance.pageSize,
          take: Config.instance.pageSize,
        }),
      ]);

      const totalPages = Math.ceil(totalResults / Config.instance.pageSize);

      return {
        totalPages,
        currentPage: pageNumber,
        criteria,
        result: results.length > 0 ? results : [],
      };
    });
  }

  async specificSearch(
    criteria: Partial<User>,
    pageNumber: number,
  ): Promise<Search<User>> {
    return await this.getBy(criteria, pageNumber);
  }
}
