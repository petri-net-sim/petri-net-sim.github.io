---
title: API and libraries
description: Connect Java applications, HTTP clients and AI assistants.
---

Choose an integration according to where the simulation should run.

| Integration | Use it for | Guide |
| --- | --- | --- |
| `petri-math` | Java simulation engine | [Java libraries](/desktop/docs/java-libraries/) |
| `petri-api` | Shared interfaces, events and DTOs | [Java libraries](/desktop/docs/java-libraries/) |
| `petri-model` | Graph representation and PNML I/O | [Java libraries](/desktop/docs/java-libraries/) |
| `petri-server` | Simulation over REST, SSE and WebSocket | [Server integration](/desktop/docs/petri-server-integration/) |
| Desktop MCP | Operate the open desktop editor from an assistant | [Desktop MCP](/desktop/docs/desktop-mcp/) |
| Web HTTP API and MCP | Drive Petri Net Sim from clients and assistants | [Web integrations](/web/docs/integrations/) |
| Modeling resources | Reuse modeling guidance, patterns and schemas | [Resource package](/modeling/overview/) |

## Java libraries

The library modules have independent versions. Copy dependencies from the [integration guide](/desktop/docs/java-libraries/) and check the [published Maven repository](https://github.com/StetsenkoInna/PetriObjModelPaint/tree/maven-repository). Java 23 or newer is required.

The engine, API and graph model modules use the MIT license. The desktop UI and server have separate license terms. Check the license of each module you distribute.

## HTTP contracts

The documentation pipeline exports OpenAPI from both applications and builds Java reference documentation. The generated references are available here after a successful reference build:

- [petri-server API reference and OpenAPI](/reference/desktop/)
- [Petri Net Sim API reference and OpenAPI](/reference/web/)
- [Java API reference](/reference/java/)

For local interactive API documentation, both applications expose `/docs` when their configuration enables it. Read the installation-specific configuration instead of assuming that documentation routes are available in every deployment.

For Petri Net Sim, `GET /api/v1/config` reports the configured API and MCP paths. Authentication, per-account integration switches, streaming behavior and examples are described in the [connection guide](/web/docs/integrations/).

## File and model contracts

- [PNML guidance](/modeling/petri_modeling_skills/skills/pnml-standard/skill/)
- [Petri-object interchange](/desktop/docs/petri-object-models/)
- [Desktop training exports](/desktop/docs/training-data-export/)
- [Web training archives and review](/web/docs/training-review/)
