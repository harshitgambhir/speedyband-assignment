import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TopSongsData } from "./types";
import { ResponsiveContainer } from "recharts";

const fetchData = async () => {
  const response = await fetch("/api/top-songs");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const chartConfig = {
  streams: {
    label: "Streams",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const TopSongsChart: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  const { data, isLoading, error } = useQuery<TopSongsData[]>({
    queryKey: ["topSongs"],
    queryFn: fetchData,
  });

  if (isLoading) return <></>;
  if (error) return <div>An error has occurred</div>;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top 5 Streamed Songs</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="streams" fill="var(--color-streams)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    value.toLocaleString()
                  }
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopSongsChart;
