import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import KeyMetrics from "./key-metrics";
import { makeServer } from "@/mirage/server";

const queryClient = new QueryClient();

// Mock the entire @tanstack/react-query module
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );

  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe("KeyMetrics Component", () => {
  let server: ReturnType<typeof makeServer>;

  beforeAll(() => {
    server = makeServer();
  });

  afterAll(() => {
    server.shutdown();
  });

  it("renders loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <KeyMetrics />
      </QueryClientProvider>
    );

    expect(screen.queryByText("Total Users")).not.toBeInTheDocument();
  });

  it("renders error state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network Error"),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <KeyMetrics />
      </QueryClientProvider>
    );

    expect(screen.getByText(/An error has occurred/)).toBeInTheDocument();
  });

  it("renders no data state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <KeyMetrics />
      </QueryClientProvider>
    );

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders correctly when data is available", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        totalUsers: 1000,
        activeUsers: 500,
        totalStreams: 2000,
        revenue: 10000,
        topArtist: "Artist Name",
      },
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <KeyMetrics />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Total Users")).toBeInTheDocument();
      expect(screen.getByText("1,000")).toBeInTheDocument();
      expect(screen.getByText("Active Users")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("Total Streams")).toBeInTheDocument();
      expect(screen.getByText("2,000")).toBeInTheDocument();
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("$10,000")).toBeInTheDocument();
      expect(screen.getByText("Top Artist")).toBeInTheDocument();
      expect(screen.getByText("Artist Name")).toBeInTheDocument();
    });
  });
});
