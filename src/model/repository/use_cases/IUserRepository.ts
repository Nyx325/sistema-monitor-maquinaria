import { User } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { NewUser } from "./UserRepository.js";

export interface IUserRepository extends IRepository<User, NewUser, number> {
  getUser(usr: string, pwd: string): Promise<User | null>;
}
