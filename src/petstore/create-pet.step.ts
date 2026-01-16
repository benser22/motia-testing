import { ApiRouteConfig, ApiRouteHandler } from "motia";
import { z } from "zod";
import { petStoreService } from "../services/pet-store";
import { petSchema } from "../services/types";

export const config: ApiRouteConfig = {
  type: "api",
  name: "CreatePet",
  description: "Create a new pet",
  method: "POST",
  path: "/pets",
  bodySchema: z.object({
    name: z.string(),
    photoUrl: z.string(),
  }),
  responseSchema: {
    201: petSchema,
  },
  emits: ["pet.created"],
  virtualEmits: [{ topic: "pet.created", label: "Pet created" }],
  flows: ["petstore-main"],
};

export const handler: ApiRouteHandler<any, any, any> = async (
  req,
  { logger, emit },
) => {
  const { name, photoUrl } = req.body as any;
  logger.info("Creating pet", { name });
  const pet = await petStoreService.createPet({ name, photoUrl });

  // Emit runtime event so event steps can react
  await emit({
    topic: "pet.created",
    data: pet,
  });

  return { status: 201, body: pet };
};
