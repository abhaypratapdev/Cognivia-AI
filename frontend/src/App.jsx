import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Error404 from "./components/Error404/Error404";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Layout from "./components/Layout/Layout";


// Pages
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import BuySell from "./pages/BuySell/BuySell";
import LostFound from "./pages/LostFound/LostFound";
import Planner from "./pages/Planner/Planner";
import Summarizer from "./pages/Summarizer/Summarizer";
import Quiz from "./pages/Quiz/Quiz";
import Profile from "./pages/Profile/Profile";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

import "./index.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <Router>
              <div className="min-h-screen w-full transition-colors relative overflow-x-hidden">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Navbar />
                        <Landing />
                      </>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <>
                        <Navbar />
                        <Login />
                      </>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <>
                        <Navbar />
                        <Signup />
                      </>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <>
                        <Navbar />
                        <ForgotPassword />
                      </>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buy-sell"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <BuySell />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lost-found"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <LostFound />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/planner"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Planner />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/summarizer"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Summarizer />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/quiz"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Quiz />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
  path="/quiz/:fileId"
  element={
    <ProtectedRoute>
      <Layout>
        <Quiz />
      </Layout>
    </ProtectedRoute>
  }
/>
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/leaderboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Leaderboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/404"
                    element={
                      <>
                        <Navbar />
                        <Error404 />
                      </>
                    }
                  />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#fff",
                      },
                    },
                    error: {
                      duration: 4000,
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#fff",
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
