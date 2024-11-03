import { ApiSnapshot } from "@prisma/client";
import { IRepository } from "./IRepository.js";

export type NewSnapshot = Omit<
  ApiSnapshot,
  "active" | "snapshot_id" | "snapshot_total_pages" | "active"
>;

export type ISnapshotRepository = IRepository<ApiSnapshot, NewSnapshot, number>;
