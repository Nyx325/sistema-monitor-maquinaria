import { User } from "@prisma/client";
import { IRepository } from "./IRepository.js";

export type NewUser = Omit<User, "active" | "user_id">;
export type UserRepository = IRepository<User, number>;
