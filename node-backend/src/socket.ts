import { DefaultEventsMap, Server, Socket } from "socket.io";
import { IncomingMessage, ServerResponse } from "node:http";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

import { secretKey } from "./constants";

export const createSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.engine.use(
    (
      req: IncomingMessage & {
        _query: {
          sid: string;
        };
        user?: any;
      },
      res: ServerResponse,
      next: (err?: Error) => void,
    ) => {
      const isHandshake = req._query.sid === undefined;
      if (!isHandshake) {
        return next();
      }

      const refreshToken = cookie.parse(req.headers.cookie!)["refreshToken"];

      if (!refreshToken) {
        return next(new Error("no token"));
      }

      jwt.verify(refreshToken, secretKey, (err, decoded) => {
        if (err) {
          return next(new Error("invalid token"));
        }
        req.user = decoded;
        next();
      });
    },
  );

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);
    handleSocketConnection(socket);
  });

  return io;
};

export const handleSocketConnection = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
  console.log("Socket connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    // Handle incoming message
  });

  socket.on("callUser", (data) => {
    socket.broadcast.emit("callUser", data);
    console.log("Call user event:", data);
  });

  socket.on("acceptCall", (data) => {
    socket.broadcast.emit("acceptCall", data);
    console.log("Accept call event:", data);
  });

  socket.on("iceCandidate", (data) => {
    socket.broadcast.emit("iceCandidate", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });

  // Add more event listeners as needed
};
