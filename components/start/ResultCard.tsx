import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResultCardProps = {
  title: string;
  items: string[];
};

export function ResultCard({ title, items }: ResultCardProps) {
  const titleId = `result-card-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <Card aria-labelledby={titleId} className="h-full bg-card/85" role="region">
      <CardHeader>
        <CardTitle className="text-xl" id={titleId}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
