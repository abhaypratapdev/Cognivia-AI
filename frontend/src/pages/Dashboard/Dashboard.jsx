import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiAward,
  FiStar,
  FiFileText,
  FiBookOpen,
  FiCheckCircle,
  FiTrendingUp,
  FiClock,
  FiZap,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Loading from "../../components/Loading/Loading";
import Notifications from "../../components/Notifications/Notifications";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    filesUploaded: 0,
    summariesCreated: 0,
    quizzesTaken: 0,
  });
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [plans, setPlans] = useState([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({
          filesUploaded: 0,
          summariesCreated: 0,
          quizzesTaken: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/leaderboard");
        setLeaderboard(res.data.slice(0, 5)); // Get top 5
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLeaderboard([]);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await api.get("/planner");
        setPlans(res.data.slice(0, 1)); // Get latest plan
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      }
    };

    fetchData();
    fetchLeaderboard();
    fetchPlans();
  }, []);

  // Calculate percentages for pie charts
  const total =
    (stats.filesUploaded || 0) +
    (stats.summariesCreated || 0) +
    (stats.quizzesTaken || 0);
  const safeTotal = total > 0 ? total : 1;
  const bitcoinPercent =
    Math.round(((stats.filesUploaded || 0) / safeTotal) * 100) || 73;
  const ethereumPercent =
    Math.round(((stats.summariesCreated || 0) / safeTotal) * 100) || 22;
  const usdtPercent =
    Math.round(((stats.quizzesTaken || 0) / safeTotal) * 100) || 5;

  // Mock data for activity chart
  const activityData = [
    { day: "Mon", value: stats.filesUploaded || 2 },
    { day: "Tue", value: (stats.filesUploaded || 0) + 3 },
    { day: "Wed", value: (stats.filesUploaded || 0) + 5 },
    { day: "Thu", value: (stats.summariesCreated || 0) + 4 },
    { day: "Fri", value: (stats.summariesCreated || 0) + 6 },
    { day: "Sat", value: (stats.quizzesTaken || 0) + 3 },
    { day: "Sun", value: (stats.quizzesTaken || 0) + 5 },
  ];

  const quickActions = [
    {
      icon: FiFileText,
      label: "Upload File",
      path: "/summarizer",
      color: "bg-blue-500",
    },
    {
      icon: FiBookOpen,
      label: "Take Quiz",
      path: "/quiz",
      color: "bg-purple-500",
    },
    {
      icon: FiCalendar,
      label: "Create Plan",
      path: "/planner",
      color: "bg-green-500",
    },
    {
      icon: FiZap,
      label: "Buy & Sell",
      path: "/buy-sell",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
        {/* Header with Welcome Message */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                {greeting}! 👋
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Here's what's happening with your studies today
              </p>
            </div>
            <div className="flex gap-2">
              {quickActions.slice(0, 2).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className={`${action.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-md flex items-center gap-2 text-sm font-medium`}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Section - Improved Cards */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Activity Overview
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Track your progress and achievements
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Files Uploaded Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-yellow-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <FiFileText className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-green-600 font-semibold flex items-center gap-1 text-xs bg-green-50 px-2 py-1 rounded-full">
                  <FiTrendingUp className="w-3 h-3" />
                  {bitcoinPercent}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-700 text-sm mb-1">
                Files Uploaded
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.filesUploaded || 0}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiClock className="w-3 h-3" />
                <span>This month</span>
              </div>
            </div>

            {/* Summaries Created Card */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-red-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <FiBookOpen className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-red-600 font-semibold flex items-center gap-1 text-xs bg-red-50 px-2 py-1 rounded-full">
                  <FiArrowDown className="w-3 h-3" />
                  {ethereumPercent}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-700 text-sm mb-1">
                Summaries Created
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.summariesCreated || 0}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiClock className="w-3 h-3" />
                <span>This month</span>
              </div>
            </div>

            {/* Quizzes Taken Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-green-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 font-semibold flex items-center gap-1 text-xs bg-green-50 px-2 py-1 rounded-full">
                  <FiTrendingUp className="w-3 h-3" />
                  {usdtPercent}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-700 text-sm mb-1">
                Quizzes Taken
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.quizzesTaken || 0}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiClock className="w-3 h-3" />
                <span>This month</span>
              </div>
            </div>

            {/* Notifications Card */}
            <Notifications />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Leaderboard Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiAward className="w-5 h-5 text-yellow-500" />
                  Leaderboard
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Top performers in quizzes and activities
                </p>
              </div>
              <button
                onClick={() => navigate("/leaderboard")}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs sm:text-sm font-medium"
              >
                View All
                <FiArrowUp className="w-3 h-3 rotate-45" />
              </button>
            </div>
            <div className="space-y-3">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div
                    key={entry._id || index}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300"
                        : index === 2
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10">
                        {index === 0 ? (
                          <div className="relative">
                            <FiAward className="w-7 h-7 text-yellow-500" />
                            <span className="absolute -top-1 -right-1 text-xs font-bold text-yellow-600">
                              1
                            </span>
                          </div>
                        ) : index === 1 ? (
                          <div className="relative">
                            <FiStar className="w-7 h-7 text-gray-400" />
                            <span className="absolute -top-1 -right-1 text-xs font-bold text-gray-500">
                              2
                            </span>
                          </div>
                        ) : index === 2 ? (
                          <div className="relative">
                            <FiAward className="w-7 h-7 text-orange-600" />
                            <span className="absolute -top-1 -right-1 text-xs font-bold text-orange-600">
                              3
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 font-bold text-lg">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        {entry.user?.photo ? (
                          <img
                            src={entry.user.photo}
                            alt={entry.user.name}
                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-gray-200">
                            {entry.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {entry.user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {entry.user?.college || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600 text-lg">
                            {entry.totalScore || 0}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.quizzesTaken || 0} quizzes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FiAward className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No leaderboard data yet</p>
                  <p className="text-sm mt-1">Be the first to take a quiz!</p>
                </div>
              )}
            </div>
          </div>

          {/* Revision Planner Card */}
          <div className="bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-pink-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-pink-200 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                  Revision Planner
                </h3>
              </div>
              <button
                onClick={() => navigate("/planner")}
                className="p-2 bg-white rounded-lg hover:bg-pink-100 transition text-pink-600"
                title="Create new plan"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
            {plans.length > 0 ? (
              <div className="space-y-3">
                {plans.map((plan) => {
                  const examDate = plan.examDate
                    ? new Date(plan.examDate)
                    : null;
                  const daysLeft = examDate
                    ? Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24))
                    : null;
                  return (
                    <div
                      key={plan._id}
                      className="bg-white/80 rounded-xl p-4 border border-pink-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {plan.name || "Study Plan"}
                        </h4>
                        {daysLeft !== null && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              daysLeft < 7
                                ? "bg-red-100 text-red-600"
                                : daysLeft < 30
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Subjects:</span>
                          <span className="text-gray-700">
                            {plan.subjects?.join(", ") || "N/A"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Hours/Day:</span>
                          <span className="text-gray-700">
                            {plan.hoursPerDay || "N/A"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Exam:</span>
                          <span className="text-gray-700">
                            {examDate ? examDate.toLocaleDateString() : "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-pink-100 rounded-full flex items-center justify-center">
                  <FiCalendar className="w-8 h-8 text-pink-500" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  No plans yet
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Create a study plan to stay organized
                </p>
                <button
                  onClick={() => navigate("/planner")}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition text-sm font-medium shadow-md"
                >
                  Create Plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Weekly Activity
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Your activity over the past week
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
