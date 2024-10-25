import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { IConnector } from "./IConnector.js";

export class PrismaConnector implements IConnector<PrismaClient> {
  private pool: PrismaClient[]; // Pool de conexiones
  private maxPoolSize: number; // Máximo número de conexiones en el pool

  constructor() {
    dotenv.config(); // Carga las variables de entorno desde el archivo .env

    this.pool = [];
    const poolSize = Number(process.env.POOL_SIZE);
    this.maxPoolSize = isNaN(poolSize) ? 5 : poolSize;
  }

  /**
   * Obtiene una conexión de PrismaClient del pool. Si no hay conexiones disponibles, crea una nueva si no se ha alcanzado el límite.
   * @returns {Promise<PrismaClient>} La instancia de PrismaClient.
   */
  async getConnection(): Promise<PrismaClient> {
    if (this.pool.length > 0) {
      // Devuelve una conexión existente del pool
      return this.pool.pop()!;
    } else if (this.pool.length < this.maxPoolSize) {
      // Crea una nueva conexión si no se ha alcanzado el límite
      const client = new PrismaClient();
      await client.$connect(); // Conectar a la base de datos
      return client;
    } else {
      throw new Error("Se ha alcanzado el límite del pool de conexiones.");
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
