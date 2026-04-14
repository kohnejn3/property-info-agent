# property-info-agent

[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![OpenAI Agents SDK](https://img.shields.io/badge/OpenAI-Agents%20SDK-412991)](https://github.com/openai/openai-agents-js)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A minimal, reliable agent that takes a U.S. street address and returns **structured real-estate facts** — square footage, year built, beds, baths, lot size — grounded in live web search with explicit confidence scoring and source attribution.

Built on the [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) with a strict [Zod](https://zod.dev) output schema so the JSON you get back is always the shape you expect.

## Example

```bash
$ npm run retrieve -- "1600 Pennsylvania Ave NW, Washington, DC 20500"
```

```json
{
  "address": "1600 Pennsylvania Ave NW, Washington, DC 20500",
  "square_footage": 55000,
  "year_built": 1800,
  "bedrooms": 35,
  "bathrooms": 35,
  "acreage": 18.07,
  "stories": 6,
  "confidence": "High",
  "estimated": false,
  "sources": [
    "https://en.wikipedia.org/wiki/White_House",
    "https://www.whitehouse.gov/about-the-white-house/"
  ]
}
```

## What it demonstrates

- **Schema-first agent design** — Zod schema defines the contract; the agent is forced to return valid JSON or throw
- **Grounded retrieval** — web-search tool use with explicit confidence and source URLs; no hallucinated numbers
- **Null-safe extraction** — every numeric field is `number | null`; missing data is declared, not invented
- **Ergonomic CLI + library** — single-address CLI for testing, `retrievePropertyInfo()` export for programmatic integration

## Output schema

| Field | Type | Notes |
|---|---|---|
| `address` | `string` | Echoed from input |
| `square_footage` | `int \| null` | Living area |
| `year_built` | `int \| null` | |
| `bedrooms` | `int \| null` | |
| `bathrooms` | `number \| null` | Half baths as decimals (e.g., `2.5`) |
| `acreage` | `number \| null` | Lot size, converted to acres |
| `stories` | `number \| null` | |
| `confidence` | `"High" \| "Medium" \| "Low"` | High = ≥2 reputable sources agree |
| `estimated` | `boolean` | `true` if any field was inferred vs. directly sourced |
| `sources` | `string[]` | URLs used for the response |

## Setup

```bash
npm install
cp .env.example .env
# edit .env and add your OPENAI_API_KEY
```

## Usage

### CLI

```bash
npm run retrieve -- "<full U.S. address>"
```

### Programmatic

```typescript
import { retrievePropertyInfo } from "property-info-agent";

const info = await retrievePropertyInfo("1600 Pennsylvania Ave NW, Washington, DC 20500");
console.log(info.confidence, info.square_footage);
```

## How it works

1. CLI parses the address and checks `OPENAI_API_KEY`
2. `retrievePropertyInfo()` invokes an `@openai/agents` agent with strict system instructions (prefer county assessor records; require ≥1 targeted web search; never fabricate)
3. The agent uses `webSearchTool` for grounded lookups and returns output validated against the Zod schema
4. The CLI prints the structured result; the library returns it as a typed object

## Project structure

```
src/
├── agent.ts                 # Zod schema + agent definition + system prompt
├── retrievePropertyInfo.ts  # Library entrypoint (address → structured info)
└── index.ts                 # CLI wrapper
```

## License

MIT — see [LICENSE](./LICENSE).
