import { IssueFinder } from "@/components/site/IssueFinder";

export function Hero() {
  return (
    <section aria-labelledby="home-heading" className="border-y-4 border-foreground">
      <IssueFinder />
    </section>
  );
}
