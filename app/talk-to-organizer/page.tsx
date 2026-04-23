import { EncryptionNotice } from "@/components/intake/EncryptionNotice";
import { IntakeForm } from "@/components/intake/IntakeForm";
import { OrganizerKeyCard } from "@/components/intake/OrganizerKeyCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { getIntakeRetentionPolicy } from "@/lib/intake/config";
import { getPublicIntakeKeyMetadata } from "@/lib/intake/publicKey";

export default function TalkToOrganizerPage() {
  const retentionPolicy = getIntakeRetentionPolicy();
  const keyMetadata = getPublicIntakeKeyMetadata();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Encrypted intake"
        title="Reach out without sending your full story to the server in plaintext."
        description="If you want organizer support, you can use this form. The message is encrypted in the browser before it is sent, and the server only stores ciphertext plus limited coarse metadata."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <EncryptionNotice retentionPolicy={retentionPolicy} />
        <OrganizerKeyCard keyMetadata={keyMetadata} retentionPolicy={retentionPolicy} />
      </div>
      <IntakeForm />
    </div>
  );
}
