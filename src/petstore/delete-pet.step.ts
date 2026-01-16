import { ApiRouteConfig, ApiRouteHandler } from "motia";
import { z } from "zod";
import { petStoreService } from "../services/pet-store";

export const config: ApiRouteConfig = {
  type: "api",
  name: "DeletePet",
  description: "Delete a pet by ID",
  method: "DELETE",
  path: "/pets/:id([0-9a-fA-F-]+)",
  responseSchema: {
    200: z.object({ message: z.string().optional() }),
    404: z.object({ message: z.string() }),
  },
  emits: [],
};

export const handler: ApiRouteHandler = async (req, { logger }) => {
  const { id } = req.pathParams;
  logger.info("Deleting pet", { id });

  try {
    const res = await petStoreService.deletePet(id);
    return { status: 200, body: res };
  } catch (err) {
    return { status: 404, body: { message: "Error deleting pet" } };
  }
};
