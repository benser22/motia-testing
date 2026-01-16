import { ApiRouteConfig, ApiRouteHandler } from "motia";
import { z } from "zod";
import { petStoreService } from "../services/pet-store";
import { petSchema } from "../services/types";

export const config: ApiRouteConfig = {
  type: "api",
  name: "GetPet",
  description: "Get a pet by ID",
  emits: [],
  method: "GET",
  path: "/pets/:id",
  responseSchema: {
    200: petSchema,
    404: z.object({ message: z.string() }),
  },
};

export const handler: ApiRouteHandler = async (req, { logger }) => {
  const { id } = req.pathParams;
  logger.info("Getting pet by ID", { id });

  try {
    const pet = await petStoreService.getPetById(id);
    if (!pet || (pet as any).code === 1) {
      return { status: 404, body: { message: "Pet not found" } };
    }
    return { status: 200, body: pet };
  } catch (error) {
    return { status: 404, body: { message: "Error retrieving pet" } };
  }
};
