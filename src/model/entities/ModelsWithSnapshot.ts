import { Prisma } from "@prisma/client";

export type LocationWithSnapshot = Prisma.LocationGetPayload<{
  include: { snapshot: true };
}>;

export type COHWithSnapshot = Prisma.CumulativeOperatingHoursGetPayload<{
  include: { snapshot: true };
}>;

export type FuelUsedWithSnapshot = Prisma.FuelUsedGetPayload<{
  include: { snapshot: true };
}>;
