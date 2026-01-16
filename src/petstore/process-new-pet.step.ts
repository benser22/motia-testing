import type { EventConfig, Handlers } from "motia";

export const config: EventConfig = {
  type: "event",
  name: "ProcessNewPet",
  description: "Process newly created pet and trigger notifications",
  subscribes: ["pet.created"],
  emits: ["notification"],
  // virtual connection for Workbench visualization
  virtualSubscribes: ["pet.created"],
  flows: ["petstore-main"],
};

export const handler: Handlers["ProcessNewPet"] = async (
  input,
  { logger, emit },
) => {
  logger.info("Processing new pet", { petId: (input as any).id });

  await emit({
    topic: "notification",
    data: {
      email: process.env.SAMPLE_EMAIL || "test@test.com",
      templateId: "new-pet-created",
      templateData: { pet: input },
    },
  });

  logger.info("Notification emitted for new pet", { petId: (input as any).id });
};
