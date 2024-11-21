import { $Enums } from "@prisma/client";

export type UserData = {
  user_id: number;
  user_name: string;
  full_name: string;
  email: string;
  user_type: $Enums.UserType;
};
