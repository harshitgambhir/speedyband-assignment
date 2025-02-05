import { lazy } from "react";
import "./App.css";
import { Header } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";

const Dashboard = lazy(() => import("@/components/dashboard"));

function App() {
  return (
    <>
      <AppSidebar />
      <div className="ml-auto w-full max-w-full peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))] transition-[width] duration-200 ease-linear flex h-svh flex-col group-data-[scroll-locked=1]/body:h-full group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh">
        <Header>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Dashboard />
      </div>
    </>
  );
}

export default App;
