import "dotenv/config";

import app from "./src/app.js";
import connectDatabase from "./src/config/database.js";
import http from "http";
import { initSocketServer } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
initSocketServer(server);

// Start sequence: connect DB first, then start accepting HTTP requests.
const startServer = async () => {
	try {
		await connectDatabase();

		// App listens only after a successful database connection.
		server.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		// Exit on startup failure so process managers can restart it.
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};


startServer();
