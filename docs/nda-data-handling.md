# NDA and data handling

## The scenario

An NDA is signed. Books, records, leases, customer information and service files arrive. Someone wants an AI-generated deal brief. The practical question is **who is authorized to process these records, where can they go, and what can be retained?**

We do not claim every cloud upload breaches an NDA. It depends on the agreement, on authorization, on applicable obligations, and on the service's processing terms. Read the agreement and ask.

## Design goals (not implemented)

These describe what we intend to build toward. None is implemented or verified today.

- Owner-controlled storage and local inference where feasible.
- No external document transfer by default.
- Explicit approval before any external model or service is used.
- Purpose-limited access.
- Separation of confidential project files from public datasets.
- Source-linked findings.
- Configurable retention and deletion.
- Human review before a brief is shared.

## What local processing does not solve

Running locally does not by itself guarantee confidentiality or compliance. Account for logs, temporary files, embeddings and indexes, backups, OCR output, dependencies, telemetry and remote access.

## Open source is not open data

Open-source code does not make client documents public. No private documents, derived text or identifiable client information belongs in a public dataset without appropriate authorization.

## What exists in this repository today

- The public website accepts **no uploads** and has no backend, forms, analytics or outbound document-processing calls.
- `/deal-room/` is a **local-only prototype**: you choose files in your browser and it reads only file names, sizes and types, to build a document checklist and a gap list. It never reads file contents, stores nothing, and makes no network requests. `public/_headers` sets a Content-Security-Policy with `connect-src 'none'` for that page.
- It is not a secured deal room. A real one needs authenticated storage, per-user access control, audit logging, retention controls and a hosting decision. That is unbuilt.

## Repository guidance

- Use **synthetic fixtures** for tests and examples.
- `.gitignore` lists private working directories (`private/`, `deal-room-private/`) so they are not committed by accident. **`.gitignore` is not an access-control system.** It does not protect files that are already tracked, copied elsewhere, or present on a shared machine.
- Add no trackers and no outbound document-processing APIs.
