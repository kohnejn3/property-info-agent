import "dotenv/config";

import { retrievePropertyInfo } from "./retrievePropertyInfo.js";

function readAddressFromCliArgs(args: string[]): string {
  const address = args.join(" ").trim();
  if (!address) {
    console.error('Usage: npm run retrieve -- "<full-us-address>"');
    process.exit(1);
  }
  return address;
}

async function main(): Promise<void> {
  const address = readAddressFromCliArgs(process.argv.slice(2));

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in environment.");
    process.exit(1);
  }

  const propertyInfo = await retrievePropertyInfo(address);
  process.stdout.write(`${JSON.stringify(propertyInfo, null, 2)}\n`);
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unexpected error while running agent.");
  }
  process.exit(1);
});
