import { io } from "socket.io-client";

// create ONE socket connection
export const socket = io( import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  reconnectionDelayMax: 3000,
  timeout: 10000,
  autoConnect: false,
});