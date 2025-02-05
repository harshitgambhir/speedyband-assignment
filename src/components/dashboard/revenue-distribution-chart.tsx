import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { RevenueDistributionData } from "./types";

const fetchData = async () => {
  const response = await fetch("/api/revenue-distribution");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const chartConfig = {
  value: {
    label: "Revenue",
  },
  Subscriptions: {
    label: "Subscriptions",
    color: "hsl(var(--chart-1))",
  },
  Ads: {
    label: "Ads",
    color: "hsl(var(--chart-2))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const RevenueDistributionChart: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className }) => {
  const { data, isLoading, error } = useQuery<RevenueDistributionData[]>({
    queryKey: ["revenueDistribution"],
    queryFn: fetchData,
  });

  if (isLoading) return <></>;
  if (error) return <div>An error has occurred</div>;

  const chartData = data?.map((item) => {
    return {
      ...item,
      fill: `var(--color-${item.name})`,
    };
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Revenue Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="value" hideLabel />}
              />
              <Pie data={chartData} dataKey="value">
                <LabelList
                  dataKey="name"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueDistributionChart;
