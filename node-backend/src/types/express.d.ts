import { User } from "./custom";

// to make the file a module and avoid the TypeScript error

declare global {
  namespace Express {
    // extend the built in User with your own custom properties
    interface User extends CustomUser {}

    // Extend the request and response objects with your own custom properties
    interface Request {
      user?: User;
    }
  }
}
