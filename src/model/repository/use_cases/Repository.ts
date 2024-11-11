import { Prisma } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { Search } from "../../entities/Search.js";

export abstract class Repository<M, NM, I> implements IRepository<M, NM, I> {
  abstract add(model: NM): Promise<M>;

  abstract delete(model: M): Promise<void>;

  abstract get(id: I): Promise<M | undefined>;

  abstract getBy(criteria: Partial<M>, pageNumber: number): Promise<Search<M>>;

  abstract update(model: M): Promise<void>;

  abstract specificSearch(
    criteria: Partial<M>,
    pageNumber: number,
  ): Promise<Search<M>>;

  getDateFilter(date: Date): Prisma.DateTimeFilter {
    // Define el inicio y el final del día especificado en snapshotD
    const startOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0, // Inicio del día
      ),
    );

    const endOfDay = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999, // Fin del día
      ),
    );

    return {
      gte: startOfDay,
      lte: endOfDay,
    };
  }
}
