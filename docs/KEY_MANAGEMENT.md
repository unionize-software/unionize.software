# Key Management

## Public intake key publishing

When a new organizer intake key is activated, publish these values together:

- key ID
- SHA-256 fingerprint
- rotation date

Workers and organizers should be able to verify the fingerprint through a second channel before trusting a newly shared key.

## Rotation

1. Generate a fresh keypair on an organizer-controlled machine.
2. Update the public site environment with the new key ID, public key, and rotation date.
3. Record the new key metadata in `organizer_public_keys`.
4. Keep the previous private key accessible until the intake retention window and purge grace window have both elapsed.
5. Mark the old key inactive and set `revoked_at` when it should no longer decrypt newly submitted intake.

## Compromise response

If a private key is suspected to be compromised:

1. Disable intake or rotate immediately.
2. Publish the new fingerprint through trusted channels.
3. Treat ciphertext associated with the compromised key as higher-risk.
4. Review local organizer-machine security before resuming normal intake handling.

## Backups

Private key backups should stay offline or in an organizer-controlled secure vault. Do not store them in the repo, browser environments, shared chat, or general-purpose SaaS notes.
