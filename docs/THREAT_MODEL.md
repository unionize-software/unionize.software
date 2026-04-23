# Threat Model

## Primary risks

- Employer discovery of organizing activity
- Server compromise exposing intake metadata
- Subpoena or legal process aimed at stored records
- Admin account compromise
- Accidental logging of sensitive fields
- Third-party analytics leakage
- Misconfigured encryption keys
- Intake spam or probing intended to exhaust organizer attention

## Design response in V1

- Keep the public site useful without requiring accounts
- Keep Start Here answers off the server entirely
- Encrypt organizer intake client-side
- Store only ciphertext plus coarse metadata
- Expire and purge ciphertext on a schedule
- Publish key fingerprints so rotations are auditable
- Avoid tracking vendors by default
- Delay private workspaces until threat modeling and architecture are stronger

## Known limitations

- Coarse metadata can still be identifying in small workplaces
- Public-key distribution still requires careful operational handling
- A compromised organizer machine can still expose decrypted intake data
- The public site is not a substitute for case-specific legal advice
