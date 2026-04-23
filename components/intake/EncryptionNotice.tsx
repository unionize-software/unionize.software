import { ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EncryptionNoticeProps = {
  retentionPolicy: {
    retentionDays: number;
    purgeGraceDays: number;
  };
};

export function EncryptionNotice({ retentionPolicy }: EncryptionNoticeProps) {
  return (
    <Card className="border-secondary/20 bg-secondary text-secondary-foreground">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6" />
          <CardTitle className="text-2xl">What gets stored</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-7 text-secondary-foreground/85">
        <p>
          Your full message is encrypted in the browser with the organizer public key before it is
          sent.
        </p>
        <p>
          The server only receives ciphertext, a public key identifier, and a small amount of
          coarse metadata such as urgency, region, and work type.
        </p>
        <p>
          Ciphertext is marked to expire after {retentionPolicy.retentionDays} days and should be
          purged {retentionPolicy.purgeGraceDays} days after soft-delete.
        </p>
        <p>If you can, use personal contact information and keep the region field broad.</p>
      </CardContent>
    </Card>
  );
}
