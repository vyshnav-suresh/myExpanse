// components/ThemeToggle.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useAppSelector } from "@/lib/hook/useStatesHook";
import { toggleTheme } from "@/lib/redux/features/settings/settingsSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.settings.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500 rounded-full ">
      <button
        onClick={() => dispatch(toggleTheme())}
        className="flex items-center p-2 bg-yellow-400 dark:bg-gray-700 rounded-full shadow-lg transition-colors duration-500"
      >
        {theme === "dark" ? (
          <FaMoon
            className="text-gray-300 transition-transform duration-500 transform rotate-180"
            size={24}
          />
        ) : (
          <FaSun
            className="text-yellow-500 transition-transform duration-500 transform rotate-0"
            size={24}
          />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
