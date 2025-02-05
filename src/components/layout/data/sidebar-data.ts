import { IconLayoutDashboard } from "@tabler/icons-react";
import { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Harshit",
    email: "harshitgambhir88@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: IconLayoutDashboard,
        },
      ],
    },
  ],
};
