# Security and confidentiality

We do not provide cybersecurity, incident response or engineering certification. This document lists review questions and design rules.

## Confidentiality

Local processing can reduce external transfers; it does not ensure confidentiality, cybersecurity, contract compliance or regulatory compliance. Review: who may access and process records; whether external processing is permitted; storage, embeddings, logs, temporary files and backups; retention and deletion; vendor telemetry and updates; remote support; encryption and key management; access permissions and project separation.

We do not claim every cloud upload violates an NDA, and we do not claim local deployment makes an agreement irrelevant. No confidential customer material belongs in public datasets without authorization and rights. The public website accepts no confidential uploads.

## Review questions (operational)

Unknown devices and undocumented remote connections; internet-exposed industrial controllers; shared or default credentials; excessive access permissions; vendor remote access; unpatched systems and maintenance constraints; ransomware affecting business systems; unverified or unrestorable backups; software supply-chain compromise; false, missing or delayed telemetry; physical theft or compromise of an edge appliance.

Guidance references: asset inventory, controlled access, segmentation, monitored remote access, backup restoration exercises, approved maintenance procedures. Do not patch or scan live industrial equipment without accounting for operating reliability and safety requirements.

## Review questions (AI-specific)

Instructions hidden in retrieved documents; confidential information appearing in outputs; untrusted tools and excessive agent permissions; poisoned datasets; unsupported conclusions; overconfidence under missing evidence.

Rules: treat document contents as untrusted data, not instructions; keep model outputs separate from executable commands; require explicit authorized review for consequential actions.

## Dated examples

See `new-era-sources.json`. They are cross-sector and vendor-announcement context, a snapshot as of 2026-11-09, not a threat feed. We invent no incidents, victims, losses or ransom amounts, and we do not claim coldchainOS would have prevented any event.
