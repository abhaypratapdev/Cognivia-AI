import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiSearch,
  FiFileText,
  FiBookOpen,
  FiUser,
  FiSettings,
} from "react-icons/fi";

const navItems = [
  { icon: FiHome, path: "/dashboard", label: "Dashboard" },
  { icon: FiShoppingBag, path: "/buy-sell", label: "Buy & Sell" },
  { icon: FiSearch, path: "/lost-found", label: "Lost & Found" },
  { icon: FiFileText, path: "/summarizer", label: "Smart Summarizer" },
  { icon: FiBookOpen, path: "/quiz", label: "Quiz" },
  { icon: FiUser, path: "/profile", label: "Profile" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-white shadow-lg z-40 flex flex-col items-center pt-14 sm:pt-16 pb-4 sm:pb-6 group">

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-3 sm:gap-4 pt-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname === "/");
          return (
            <div key={item.path} className="relative group/item">
              <Link
                to={item.path}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-dashboard-red text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <Icon className="w-6 h-6" />
              </Link>
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto relative group/item">
        <button className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <FiSettings className="w-6 h-6" />
        </button>
        {/* Tooltip */}
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          Settings
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
        </div>
      </div>
    </div>
  );
}
