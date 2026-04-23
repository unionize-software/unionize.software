import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OrganizerKeyCardProps = {
  keyMetadata: {
    keyId: string;
    fingerprint: string;
    rotatedAt: string | null;
  } | null;
  retentionPolicy: {
    retentionDays: number;
    purgeGraceDays: number;
  };
};

export function OrganizerKeyCard({ keyMetadata, retentionPolicy }: OrganizerKeyCardProps) {
  return (
    <Card className="bg-card/90">
      <CardHeader>
        <CardTitle className="text-2xl">How to verify the key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
        {keyMetadata ? (
          <>
            <div>
              <p className="font-semibold text-foreground">Key ID</p>
              <p className="font-[family-name:var(--font-mono)]">{keyMetadata.keyId}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">SHA-256 fingerprint</p>
              <p className="break-all font-[family-name:var(--font-mono)]">{keyMetadata.fingerprint}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Last rotated</p>
              <p>{keyMetadata.rotatedAt ?? "Not published yet"}</p>
            </div>
            <p>
              If a new key is ever published, the key ID and fingerprint should change together. If
              something looks off, wait and verify through another trusted channel.
            </p>
          </>
        ) : (
          <p>Public intake key metadata is not configured yet.</p>
        )}

        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="font-semibold text-foreground">What happens to submitted ciphertext</p>
          <p>
            New ciphertext is marked to expire after {retentionPolicy.retentionDays} days. Expired
            rows should be soft-deleted and purged {retentionPolicy.purgeGraceDays} days later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
