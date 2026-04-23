import { StartWizard } from "@/components/start/StartWizard";
import { SectionHeader } from "@/components/site/SectionHeader";

export default function StartPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Start Here"
        title="Use the pathfinder if you want help narrowing the next page to read."
        description="This stays on your device. The point is to help you get oriented without asking you to hand over a detailed story about your workplace."
      />
      <StartWizard />
    </div>
  );
}
