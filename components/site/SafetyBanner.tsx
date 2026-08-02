import Link from "next/link";

export function SafetyBanner() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-[86rem] flex-col gap-1 px-4 py-2.5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6 lg:px-10">
        <p className="font-bold">
          On a work device? Switch to a personal phone and email before organizing.
        </p>
        <Link
          className="shrink-0 font-bold underline decoration-2 underline-offset-4"
          href="/resources/safety-basics"
        >
          Read the safety basics &rarr;
        </Link>
      </div>
    </div>
  );
}
