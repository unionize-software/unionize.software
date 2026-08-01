import { IssueFinder } from "@/components/site/IssueFinder";

export function Hero() {
  return (
    <section
      aria-labelledby="home-heading"
      className="grid border-y-4 border-foreground lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]"
    >
      <div className="flex flex-col justify-between gap-12 px-1 py-9 pr-6 sm:py-12 lg:min-h-[42rem] lg:py-14 lg:pr-14">
        <div>
          <p className="field-kicker text-primary">For software and game workers</p>
          <h1 id="home-heading" className="poster-title mt-5 max-w-[8ch]">
            Start with what changed.
          </h1>
          <p className="mt-7 max-w-[34rem] text-lg leading-8 text-foreground/78 sm:text-xl sm:leading-9">
            A layoff. New tracking. A stalled promotion. Too much work. Retaliation.
            Find the closest guide before you decide what to do next.
          </p>
        </div>

        <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold text-foreground/72">
          <span>Worker-built</span>
          <span aria-hidden="true">&bull;</span>
          <span>Free to use</span>
          <span aria-hidden="true">&bull;</span>
          <span>No account</span>
        </p>
      </div>

      <IssueFinder />
    </section>
  );
}
