---
title: Your first Petri net
description: Model a queue with a single service resource.
---

A Petri net describes a system through **places**, **transitions** and **tokens**. Places hold tokens. Transitions consume tokens from their input places and produce tokens in their output places. Directed arcs connect places and transitions.

## Model a service station

Imagine jobs waiting for one machine. Use three places:

| Place | Meaning | Initial tokens |
| --- | --- | --- |
| Queue | Jobs waiting to be processed | 3 |
| Resource | An available machine | 1 |
| Done | Completed jobs | 0 |

Add a transition called **Service**. Connect Queue and Resource to Service with input arcs of weight 1. Connect Service to Done and Resource with output arcs of weight 1.

The Resource token limits the model to one service at a time. It is consumed when service begins and returned when service finishes. A completed job adds a token to Done.

## Add time

Set Service to a fixed delay of `1.5` model time units. Choose the unit yourself, such as minutes, and use it consistently throughout the model.

In the timed simulation, a job enters service when its input tokens are available. Its completion is scheduled after the selected delay. This distinction matters when reading a transition's buffer and a place's marking.

With three jobs and one machine, the expected completion times are 1.5, 3.0 and 4.5, provided there are no additional transitions or competing events. At the end, Queue holds 0 tokens, Resource holds 1 and Done holds 3.

## Run the experiment

1. Open either application and create the places and transition.
2. Set the initial markings and connect the arcs.
3. Set the service delay and a simulation horizon beyond 4.5.
4. Step through the model or run the simulation.
5. Inspect the markings, transition buffer and statistics.

Try adding a second Resource token. That permits overlapping service only when the chosen transition semantics support the corresponding concurrent firings. Check the engine's behavior rather than assuming the token count changes every constraint.

## Add arrivals and variability

Once the finite batch behaves as intended, add an arrival process and replace fixed delays with a suitable distribution. Record the assumptions, parameters and units. Run repeated experiments when results depend on random draws.

- [Simulation controls and exported results](/web/docs/simulation/)
- [Shared modeling guidance](/modeling/petri_modeling_skills/skills/petri-modeling/skill/)
- [Pattern catalog](/modeling/petri_modeling_skills/skills/petri-patterns/references/pattern-catalog/)
- [Petri-object composition](/desktop/docs/petri-object-models/)
