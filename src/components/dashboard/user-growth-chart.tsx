import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UserGrowthData } from "./types";

const fetchData = async () => {
  const response = await fetch("/api/user-growth");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const UserGrowthChart: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  const { data, isLoading, error } = useQuery<UserGrowthData[]>({
    queryKey: ["userGrowth"],
    queryFn: fetchData,
  });

  if (isLoading) return <></>;
  if (error) return <div>An error has occurred</div>;
  console.log(data);

  const chartConfig = {
    totalUsers: {
      label: "Total Users",
      color: "hsl(var(--chart-1))",
    },
    activeUsers: {
      label: "Active Users",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="totalUsers"
                type="natural"
                fill="var(--color-totalUsers)"
                fillOpacity={0.4}
                stroke="var(--color-totalUsers)"
                stackId="a"
              />
              <Area
                dataKey="activeUsers"
                type="natural"
                fill="var(--color-activeUsers)"
                fillOpacity={0.4}
                stroke="var(--color-activeUsers)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
