import { createServer } from "http";
import app from "./app";
import { createSocketServer } from "./socket";

const server = createServer(app);
createSocketServer(server);

const port = process.env.PORT || 5001;
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
