import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ResultCardProps = {
  title: string;
  items: string[];
};

export function ResultCard({ title, items }: ResultCardProps) {
  return (
    <Card className="h-full bg-card/85">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
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

