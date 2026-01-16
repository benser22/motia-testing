import { NoopConfig } from "motia";

export const config: NoopConfig = {
  type: "noop",
  name: "flow-starter",
  description: "Manual start point for Petstore flow",
  virtualEmits: ["workflow.start"],
  virtualSubscribes: ["pet.created"],
  flows: ["petstore-main"],
};

// NOOP step: no handler required. This will register the flow in Workbench.
