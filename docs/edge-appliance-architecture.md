# Edge appliance architecture (design goals)

Nothing here is implemented. Capabilities are labelled **Implemented and verified**, **Prototype** or **Planned**. We publish no performance measurements and make no support promises.

## Intended capabilities

| Capability | Status |
|---|---|
| Store authorized documents | Planned |
| Run suitable local models | Planned |
| Run deterministic calculations offline | Prototype (browser calculators; not an appliance) |
| Retrieve source passages | Planned |
| Prepare evidence-linked briefs | Planned |
| Continue supported functions without an external model connection | Planned |

## Trust boundaries

1. **Owner-controlled zone:** the appliance, its storage, and authorized users. Managed IT environment.
2. **Operational technology (OT):** refrigeration controllers, PLCs, robots, safety systems. Outside the appliance's authority.
3. **External services:** vendors, cloud models, remote support. Off by default; explicit approval before use.

Data from OT arrives only through approved read-only interfaces or controlled exports. IT and OT networks are not bridged by default. The appliance does not directly control refrigeration, PLCs, robots or safety systems, and does not require public inbound access.

## Safety stance

The appliance must not become a single point of failure for cooling. Safety controls and authorized operating procedures stay independent of language-model availability or output. Model output is never an executable command; consequential actions require explicit authorized human review.

## Risks to account for

Logs, temporary files, embeddings, indexes, backups, OCR output, dependencies, telemetry, update traffic, remote support, physical theft or compromise of the appliance, and key management. Local processing does not by itself guarantee confidentiality, cybersecurity or compliance.
