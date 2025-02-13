import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const prefersDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(prefersDarkTheme);
  }, []);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        className="theme-controller"
        value={isDark ? "emerald" : "dim"}
      />
      <Sun
        className={`${isDark ? "swap-on" : "swap-off"} h-5 w-5 fill-current`}
      />
      <Moon
        className={`${isDark ? "swap-off" : "swap-on"} h-5 w-5 fill-current`}
      />
    </label>
  );
};

export default ThemeSwitch;
