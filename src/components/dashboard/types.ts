import { months } from "@/lib/utils";

export interface MetricsData {
  totalUsers: number;
  activeUsers: number;
  totalStreams: number;
  revenue: number;
  topArtist: string;
}

export interface UserGrowthData {
  name: (typeof months)[number];
  totalUsers: number;
  activeUsers: number;
}

export interface RevenueDistributionData {
  name: "Subscriptions" | "Ads" | "Other";
  value: number;
}

export interface TopSongsData {
  name: string;
  streams: number;
}

export interface TopArtistsData {
  name: string;
  streams: number;
}

export interface RecentStreamsData {
  id: number;
  songName: string;
  artist: string;
  dateStreamed: string;
  streamCount: number;
  userId: string;
}
