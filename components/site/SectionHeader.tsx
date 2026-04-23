type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  headingLevel?: 1 | 2;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = 1,
}: SectionHeaderProps) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className="space-y-4">
      <p className="eyebrow-label text-primary">{eyebrow}</p>
      <HeadingTag className="display-title max-w-4xl text-4xl font-semibold text-balance sm:text-5xl xl:text-6xl">
        {title}
      </HeadingTag>
      <p className="max-w-3xl text-[1.06rem] leading-8 text-muted-foreground sm:text-[1.12rem]">
        {description}
      </p>
    </div>
  );
}
