import { Main } from "@/components/layout/main";
import KeyMetrics from "./key-metrics";
import DataTable from "./data-table";
import UserGrowthChart from "./user-growth-chart";
import RevenueDistributionChart from "./revenue-distribution-chart";
import TopSongsChart from "./top-songs-chart";
import TopArtistsChart from "./top-artists-chart";
import { useIsFetching } from "@tanstack/react-query";
import Spinner from "../ui/spinner";

export default function Dashboard() {
  const isLoading = useIsFetching({
    predicate: (query) => {
      return query.state.status === "pending";
    },
  });

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Main>
      <KeyMetrics />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
        <UserGrowthChart />
        <RevenueDistributionChart />
        <TopSongsChart />
        <TopArtistsChart />
      </div>
      <DataTable />
    </Main>
  );
}
