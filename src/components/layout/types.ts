interface User {
  name: string;
  email: string;
  avatar: string;
}

type NavLink = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  url: string;
  items?: never;
};

type NavItem = NavLink;

interface NavGroup {
  title: string;
  items: NavLink[];
}

interface SidebarData {
  user: User;
  navGroups: NavGroup[];
}

export type { SidebarData, NavGroup, NavItem, NavLink };
