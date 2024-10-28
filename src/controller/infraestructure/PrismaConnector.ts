import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { IConnector } from "../use_cases/IConnector.js";
import Config from "../../config.js";
import UserError from "../../model/entities/UserError.js";

export class PrismaConnector implements IConnector<PrismaClient> {
  private pool: PrismaClient[]; // Pool de conexiones

  constructor() {
    dotenv.config(); // Carga las variables de entorno desde el archivo .env

    this.pool = [];
  }

  /**
   * Obtiene una conexión de PrismaClient del pool. Si no hay conexiones disponibles, crea una nueva si no se ha alcanzado el límite.
   * @returns {Promise<PrismaClient>} La instancia de PrismaClient.
   */
  async getConnection(): Promise<PrismaClient> {
    if (this.pool.length > 0) {
      // Devuelve una conexión existente del pool
      return this.pool.pop()!;
    } else if (this.pool.length < Config.instance.poolSize) {
      // Crea una nueva conexión si no se ha alcanzado el límite
      const client = new PrismaClient();
      await client.$connect(); // Conectar a la base de datos
      return client;
    } else {
      throw new UserError(
        "Exceso de tráfico en el sistema, intente más tarde.",
      );
    }
  }

  /**
   * Libera una conexión, devolviéndola al pool.
   * @param {PrismaClient} client - La conexión a devolver al pool.
   */
  async releaseConnection(client: PrismaClient): Promise<void> {
    this.pool.push(client); // Agrega la conexión al pool
  }

  /**
   * Cierra todas las conexiones en el pool.
   */
  async disconnect(): Promise<void> {
    while (this.pool.length > 0) {
      const client = this.pool.pop();
      if (client) {
        await client.$disconnect(); // Cierra la conexión
      }
    }
  }
}
