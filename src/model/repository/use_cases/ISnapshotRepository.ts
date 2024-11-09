import { ApiSnapshot } from "@prisma/client";
import { Repository } from "./Repository.js";

export type NewSnapshot = Omit<
  ApiSnapshot,
  "active" | "snapshot_id" | "snapshot_total_pages" | "active"
>;

export type ISnapshotRepository = Repository<ApiSnapshot, NewSnapshot, number>;
