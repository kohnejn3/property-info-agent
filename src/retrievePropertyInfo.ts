import { run } from "@openai/agents";

import { propertyInfoAgent, type PropertyInfo } from "./agent.js";

export async function retrievePropertyInfo(address: string): Promise<PropertyInfo> {
  const cleanedAddress = address.trim();
  if (!cleanedAddress) {
    throw new Error("Address is required.");
  }

  const result = await run(
    propertyInfoAgent,
    `Retrieve real estate details for this U.S. address: ${cleanedAddress}`,
    { maxTurns: 20 }
  );

  if (!result.finalOutput) {
    throw new Error("Agent did not return structured output.");
  }

  return result.finalOutput;
}
