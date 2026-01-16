import { ApiRouteConfig, ApiRouteHandler } from "motia";
import { z } from "zod";
import { petStoreService } from "../services/pet-store";
import { petSchema } from "../services/types";

export const config: ApiRouteConfig = {
  type: "api",
  name: "PatchPet",
  description: "Update a pet partially",
  method: "PATCH",
  path: "/pets/:id",
  bodySchema: z.object({
    name: z.string().optional(),
    photoUrl: z.string().optional(),
  }),
  responseSchema: {
    200: petSchema,
    404: z.object({ message: z.string() }),
  },
  emits: [],
};

export const handler: ApiRouteHandler = async (req, { logger }) => {
  const { id } = req.pathParams;
  const payload = req.body as any;
  logger.info("Patching pet", { id, payload });

  try {
    const updated = await petStoreService.updatePet(id, payload);
    return { status: 200, body: updated };
  } catch (err) {
    return { status: 404, body: { message: "Error updating pet" } };
  }
};
