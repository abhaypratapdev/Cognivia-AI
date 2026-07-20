require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

// 🔑 CONNECT DATABASE FIRST
connectDB();

const server = http.createServer(app);

// OPTIONAL: Socket.IO (only if you really need it)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
});

// START SERVER
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
