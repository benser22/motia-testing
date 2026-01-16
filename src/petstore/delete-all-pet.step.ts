import { ApiRouteConfig, ApiRouteHandler } from "motia";
import { z } from "zod";
import { petStoreService } from "../services/pet-store";

export const config: ApiRouteConfig = {
  type: "api",
  name: "DeleteAllPets",
  description: "Delete all pets from the store",
  method: "DELETE",
  path: "/pets/delete-all",
  responseSchema: {
    200: z.object({ message: z.string().optional() }),
    404: z.object({ message: z.string() }),
  },
  emits: [],
};

export const handler: ApiRouteHandler = async (req, { logger }) => {
  logger.info("Deleting all pets");

  try {
    const res = await petStoreService.deleteAllPets();
    return { status: 200, body: res };
  } catch (err) {
    return { status: 404, body: { message: "Error deleting all pets" } };
  }
};
