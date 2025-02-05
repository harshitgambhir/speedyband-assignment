import { months } from "@/lib/utils";
import { createServer, Model, Factory } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  const server = createServer({
    environment,

    models: {
      user: Model,
      stream: Model,
      song: Model,
      artist: Model,
    },

    factories: {
      user: Factory.extend({
        createdAt() {
          return new Date(Date.now() - Math.floor(Math.random() * 10000000000));
        },
      }),
      stream: Factory.extend({
        songName() {
          return `Song ${Math.floor(Math.random() * 100)}`;
        },
        artist() {
          return `Artist ${Math.floor(Math.random() * 50)}`;
        },
        dateStreamed() {
          return new Date(
            Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
          );
        },
        streamCount() {
          return Math.floor(Math.random() * 1000);
        },
        userId() {
          return `user_${Math.floor(Math.random() * 1000)}`;
        },
      }),
      song: Factory.extend({
        name() {
          return `Song ${Math.floor(Math.random() * 100)}`;
        },
        artist() {
          return `Artist ${Math.floor(Math.random() * 50)}`;
        },
        streams() {
          return Math.floor(Math.random() * 500000) + 50000;
        },
      }),
      artist: Factory.extend({
        name() {
          return `Artist ${Math.floor(Math.random() * 100)}`;
        },
        streams() {
          return Math.floor(Math.random() * 500000) + 20000;
        },
      }),
    },

    seeds(server) {
      server.createList("user", 1000);
      server.createList("stream", 5000);
      server.createList("song", 100);
      server.createList("artist", 100);
    },

    routes() {
      this.namespace = "api";

      this.get("/metrics", (schema) => {
        const totalUsers = schema.all("user").length;
        const activeUsers = Math.floor(totalUsers * 0.75);
        const totalStreams = schema.all("stream").length;
        const revenue = totalStreams * 0.01;
        const topArtist = schema
          .all("song")
          .models.sort((a, b) => b.streams - a.streams)[0].artist;

        return {
          totalUsers,
          activeUsers,
          totalStreams,
          revenue,
          topArtist,
        };
      });

      this.get("/user-growth", () => {
        return months.map((month) => ({
          name: month,
          totalUsers: Math.floor(Math.random() * 1000000) + 500000,
          activeUsers: Math.floor(Math.random() * 750000) + 250000,
        }));
      });

      this.get("/revenue-distribution", () => {
        return [
          { name: "Subscriptions", value: 2000000 },
          { name: "Ads", value: 800000 },
          { name: "Other", value: 400000 },
        ];
      });

      this.get("/top-songs", (schema) => {
        return schema
          .all("song")
          .models.sort((a, b) => b.streams - a.streams)
          .slice(0, 5)
          .map((song) => ({
            name: song.name,
            streams: song.streams,
          }));
      });

      this.get("/top-artists", (schema) => {
        return schema
          .all("artist")
          .models.sort((a, b) => b.streams - a.streams)
          .slice(0, 5)
          .map((artist) => ({
            name: artist.name,
            streams: artist.streams,
          }));
      });

      this.get("/recent-streams", (schema) => {
        return schema
          .all("stream")
          .models.sort(
            (a, b) => b.dateStreamed.getTime() - a.dateStreamed.getTime()
          )
          .slice(0, 100)
          .map((stream) => ({
            id: stream.id,
            songName: stream.songName,
            artist: stream.artist,
            dateStreamed: stream.dateStreamed.toISOString(),
            streamCount: stream.streamCount,
            userId: stream.userId,
          }));
      });
    },
  });

  return server;
}
