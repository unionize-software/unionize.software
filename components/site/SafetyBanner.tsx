export function SafetyBanner() {
  return (
    <div className="border-b border-primary/15 bg-[linear-gradient(90deg,rgba(179,36,0,0.12),rgba(179,36,0,0.04))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-8">
        <p className="eyebrow-label text-primary">Safety note</p>
        <p className="text-sm font-medium text-foreground">
          Use a personal phone and personal email when you can. Stay off company devices, company
          chat, and company accounts for organizing conversations.
        </p>
      </div>
    </div>
  );
}
