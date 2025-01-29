import express from "express";
import "express-async-errors";
import { routes } from "./routes";
import { errorHandling } from "./middleware/error-handling";
import { corsOptions } from "./utils/cors-options";
import cors from "cors";

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(routes);

app.use(errorHandling);

export { app };
