import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import ChatBot from "../ChatBot/ChatBot";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side Content */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-hidden bg-dashboard-bg relative">
          {children}
        </main>

      </div>

      {/* Floating chatbot */}
      <ChatBot />
    </div>
  );
}