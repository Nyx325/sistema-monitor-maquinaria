import { UserRepository } from "../../model/repository/use_cases/UserRepository.js";
import { PrismaUserRepo } from "../../model/repository/infraestructure/PrismaUserRepo.js";
import { NewUser } from "../../model/repository/use_cases/UserRepository.js";
import UserError from "../../model/entities/UserError.js";
import { User } from "@prisma/client";

const repo: UserRepository = new PrismaUserRepo();

const isNewUserValid = async (
  model: NewUser,
  adding: boolean,
): Promise<void> => {
  const msg: string[] = [];

  if (model.email === undefined) msg.push("se debe especificar un email");

  if (model.full_name === undefined) msg.push("se debe colocar tu nombre");

  if (model.user_name === undefined)
    msg.push("se debe especificar un nombre de usuario");

  if (model.user_type === undefined)
    msg.push("se debe especificar un tipo de usuario");

  if (model.user_password === undefined)
    msg.push("se debe especificar una contraseña");

  if (adding) {
    const search = await repo.specificSearch({ user_name: model.user_name }, 1);

    if (search.result.length !== 0)
      throw new UserError("El nombre de usuario ya está en uso");
  }
};

const isUserValid = async (model: User) => {
  const msg = [];
  if (model.user_id === undefined)
    msg.push("se debe especificar un id de usuario");

  const usr: NewUser = model;
  await isNewUserValid(usr, false);
};
