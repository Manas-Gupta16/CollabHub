import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") return null

  const token = localStorage.getItem("token")
  if (!token) return null

  if (!socket || !socket.connected) {
    const getBackendUrl = () => {
      if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
      }
      if (typeof window !== "undefined" && window.location.hostname.includes("onrender.com")) {
        return "https://collabhub-backend-68xr.onrender.com"
      }
      return "http://localhost:5000"
    }

    socket = io(getBackendUrl(), {
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
