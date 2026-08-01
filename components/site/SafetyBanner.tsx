export function SafetyBanner() {
  return (
    <div className="border-b border-primary/25 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-8">
        <p className="eyebrow-label text-primary-foreground/70">Safety note</p>
        <p className="text-sm font-medium text-primary-foreground">
          Use a personal phone and personal email when you can. Stay off company devices, company
          chat, and company accounts for organizing conversations.
        </p>
      </div>
    </div>
  );
}
