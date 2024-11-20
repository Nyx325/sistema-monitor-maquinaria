import { User } from "@prisma/client";
import { IRepository } from "./IRepository.js";
import { NewUser } from "./UserRepository.js";

export type IUserRepository = IRepository<User, NewUser, number>;
