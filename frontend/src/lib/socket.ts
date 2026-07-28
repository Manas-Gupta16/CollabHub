import { io, Socket } from "socket.io-client"
import { getBackendOrigin } from "./api"

let socket: Socket | null = null

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("token")
  if (!token) return null

  if (!socket || !socket.connected) {
    socket = io(getBackendOrigin(), {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
    })
  }

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
