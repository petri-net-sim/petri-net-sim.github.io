---
title: Choose your tools
description: Download the desktop editor, run the web application, or integrate the simulation engine.
---

## Draw and simulate on your desktop

**PetriObjModelPaint** is the primary desktop application. Build Petri nets, compose Petri-object models, run simulations and inspect statistics. It runs locally without a simulation server.

- [Download the desktop application](https://github.com/StetsenkoInna/PetriObjModelPaint/releases/latest)
- [Installation and desktop UI](/desktop/docs/desktop-ui/)
- [Petri-object composition](/desktop/docs/petri-object-models/)
- [MCP connection](/desktop/docs/desktop-mcp/)
- [Training data export](/desktop/docs/training-data-export/)

The application requires Java 23 or newer. Windows, Linux and macOS packages are attached to its releases. Read the platform instructions before opening a downloaded launcher.

## Generate a model from a description

**Petri Net Sim** is the web companion. Describe a system, let an LLM build a model, then edit and simulate it in your browser. You supply your own LLM provider credentials.

The simplest installation runs a published Docker image locally. Copy the command from the [portal home page](/#tools), then open `http://localhost:6204`.

To build the all-in-one image from a checkout instead:

```bash
git clone --recurse-submodules https://github.com/sergiorbk/petri-net-sim.git
cd petri-net-sim
docker compose -f docker-compose.allinone.yml up -d --build
```

After cloning, the last command builds and starts the application. The published image currently targets `linux/amd64`. For other platforms, consult the deployment guide.

- [Running and development options](/web/docs/running/)
- [Simulation and statistics](/web/docs/simulation/)
- [Configuration](/web/docs/configuration/)
- [Deployment](/web/docs/deployment/)
- [HTTP API and MCP](/web/docs/integrations/)

## Use the engine from your own application

Use the [Java libraries](/desktop/docs/java-libraries/) for an in-process simulation engine and PNML model handling, or run [petri-server](/desktop/docs/petri-server-integration/) for HTTP, SSE and WebSocket integration.

See [API and libraries](/integrations/) for the available integration paths.

## Exchange models

Both applications use PNML. Petri-object composition, timing and other extensions carry additional modeling semantics. Review the [interchange guide](/desktop/docs/petri-object-models/) before exchanging a composed model with another tool.
