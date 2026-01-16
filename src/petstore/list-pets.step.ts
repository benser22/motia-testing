import { ApiRouteConfig, ApiRouteHandler } from "motia";
import { z } from "zod";
import { petStoreService } from "../services/pet-store";
import { petSchema } from "../services/types";

export const config: ApiRouteConfig = {
  type: "api",
  name: "ListPets",
  description: "List pets by status",
  emits: [],
  method: "GET",
  path: "/pets",
  // query params handled at runtime via `req.queryParams`
  responseSchema: {
    200: z.array(petSchema),
  },
};

export const handler: ApiRouteHandler = async (req, { logger }) => {
  const rawStatus = req.queryParams?.status;
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  logger.info("Listing pets with status", { status });

  const pets = await petStoreService.findPetsByStatus(status);
  return { status: 200, body: pets };
};
