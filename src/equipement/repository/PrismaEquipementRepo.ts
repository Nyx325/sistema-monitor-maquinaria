import { Equipement, PrismaClient } from "@prisma/client";
import { IConnector } from "../../common/controller/IConnector";
import { EquipementRepository } from "./EquipementRepository";
import { PrismaConnector } from "../../common/controller/PrismaConnector";

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
}
