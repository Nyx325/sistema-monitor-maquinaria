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

export type FuelUsed24WithSnapshot = Prisma.FuelUsedLast24GetPayload<{
  include: { snapshot: true };
}>;

export type DistanceWithSnapshot = Prisma.DistanceGetPayload<{
  include: { snapshot: true };
}>;

export type CIHWithSnapshot = Prisma.CumulativeIdleHoursGetPayload<{
  include: { snapshot: true };
}>;

export type FuelRemainingWithSnapshot = Prisma.FuelRemainingGetPayload<{
  include: { snapshot: true };
}>;

export type DefRemainingWithSnapshot = Prisma.DefRemainingGetPayload<{
  include: { snapshot: true };
}>;

export type EngineStatusWithSnapshot = Prisma.EngineStatusGetPayload<{
  include: { snapshot: true };
}>;
