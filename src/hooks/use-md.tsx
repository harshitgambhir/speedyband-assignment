import * as React from "react";

const MD_BREAKPOINT = 1024;

export function useIsMD() {
  const [isMD, setIsMD] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMD(window.innerWidth < MD_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMD(window.innerWidth < MD_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMD;
}
