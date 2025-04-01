"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const data = [
  {
    name: "Requests",
    stat: "996",
    limit: "10,000",
    percentage: 9.96,
  },
  {
    name: "Credits",
    stat: "$672",
    limit: "$1,000",
    percentage: 67.2,
  },
  {
    name: "Storage",
    stat: "1.85",
    limit: "10GB",
    percentage: 18.5,
  },
];

export default function Stats09() {
  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 m-4">
      {data.map((item) => (
        <Card key={item.name}>
          <CardContent className="">
            <dt className="text-sm text-muted-foreground">{item.name}</dt>
            <dd className="text-2xl font-semibold text-foreground">
              {item.stat}
            </dd>
            <Progress value={item.percentage} className="mt-6 h-2" />
            <dd className="mt-2 flex items-center justify-between text-sm">
              <span className="text-primary">{item.percentage}&#37;</span>
              <span className="text-muted-foreground">
                {item.stat} of {item.limit}
              </span>
            </dd>
          </CardContent>
        </Card>
      ))}
    </dl>
  );
}
