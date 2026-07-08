import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FiSun, FiMoon, FiLogOut, FiBell } from "react-icons/fi";

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          if (isBreak) {
            setMinutes(25);
            setIsBreak(false);
          } else {
            setMinutes(5);
            setIsBreak(true);
          }
          setSeconds(0);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  const formatTime = (m, s) => {
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2">
        <span className="text-lg">â±ï¸</span>
        <span className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-mono font-semibold">
          {formatTime(minutes, seconds)}
        </span>
      </div>
      <div className="flex items-center gap-1 border-l border-blue-300 dark:border-blue-700 pl-2 ml-1">
        <button
          onClick={toggle}
          className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-xs px-1.5 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
          title={isActive ? "Pause" : "Start"}
        >
          {isActive ? "â¸" : "â–¶"}
        </button>
        <button
          onClick={reset}
          className="text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-xs px-1.5 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/50 transition"
          title="Reset"
        >
          â†»
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar if not authenticated
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-3 sm:px-6 flex items-center justify-between h-14 sm:h-12 ml-2">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/dashboard" className="flex items-center">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-base sm:text-lg md:text-xl tracking-tight hover:from-blue-700 hover:to-purple-700 transition-all whitespace-nowrap">
              Congivia AI
            </span>
          </Link>
        </div>

        {/* Right side - Pomodoro Timer, Notifications, Theme toggle and Logout */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-auto">
          {/* Pomodoro Timer */}
          <div className="hidden lg:block flex-shrink-0">
            <PomodoroTimer />
          </div>

          

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300 flex-shrink-0"
            aria-label="Toggle theme"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <FiSun className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <FiMoon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* User Info */}
          {user && (
            <div className="hidden lg:flex items-center gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[60px] sm:max-w-[80px] truncate">
                {user.name}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-xs font-medium whitespace-nowrap flex-shrink-0"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
