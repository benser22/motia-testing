import type { EventConfig, Handlers } from "motia";
import { petStoreService } from "../services/pet-store";

export const config: EventConfig = {
  type: "event",
  name: "ListPetsOnCreate",
  description: "When a pet is created, list all pets and log the current list",
  subscribes: ["pet.created"],
  emits: [],
  virtualSubscribes: ["pet.created"],
  flows: ["petstore-main"],
};

export const handler: Handlers["ListPetsOnCreate"] = async (
  input,
  { logger },
) => {
  try {
    const pets = await petStoreService.findPetsByStatus();
    logger.info("ListPetsOnCreate: total pets after create", {
      count: pets.length,
    });
    logger.info("Current pets", { pets });
  } catch (err) {
    logger.error("Error listing pets on create", { err });
  }
};
