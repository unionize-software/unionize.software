# Privacy

## Product posture

unionize.software is built around data minimization.

## Start Here wizard

- The wizard uses local application state only.
- It does not create accounts.
- It does not write answers to an API or database.
- It is not connected to analytics.

## Encrypted intake

- The browser encrypts the full intake payload before submission.
- The server should receive ciphertext, `public_key_id`, `urgency`, `coarse_region`, and `work_type`.
- The API rejects obvious plaintext PII fields such as `name`, `email`, `phone`, `employer`, `context`, and `message`.
- Ciphertext is marked to expire after a defined retention window instead of being stored indefinitely.

## Analytics

V1 does not include Google Analytics, Hotjar, FullStory, session replay, ad pixels, or similar tracking.

## Logging

Operational logging should redact sensitive keys and avoid storing ciphertext or freeform worker context in logs.

## Abuse controls

The intake route applies same-origin checks, payload-size limits, and rate limits to reduce spam and probing without adding behavioral tracking.
