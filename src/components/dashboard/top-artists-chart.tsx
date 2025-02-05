import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TopArtistsData } from "./types";
import { ResponsiveContainer } from "recharts";

const fetchData = async () => {
  const response = await fetch("/api/top-artists");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const chartConfig = {
  streams: {
    label: "Streams",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const TopArtistsChart: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  const { data, isLoading, error } = useQuery<TopArtistsData[]>({
    queryKey: ["topArtists"],
    queryFn: fetchData,
  });

  if (isLoading) return <></>;
  if (error) return <div>An error has occurred</div>;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top 5 Streamed Artists</CardTitle>
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
              <YAxis tickMargin={10} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="streams"
                fill="var(--color-streams)"
                radius={8}
              ></Bar>
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopArtistsChart;
