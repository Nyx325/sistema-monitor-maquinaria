import { Location } from "@prisma/client";
import { NewLocation } from "../../../model/repository/use_cases/ILocationRespository.js";
import { IAdapter } from "../use_cases/IAdapter.js";

export default class LocationAdapter extends IAdapter<
  Location,
  NewLocation,
  number
> {
  constructor() {
    super("localizacion");
  }
}
