import express from "express";
import dotenv from "dotenv";
import { i18nMiddleware } from "./middlewares/i18n.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import routes from "./routes/index.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);
app.use(generalLimiter);
app.use(routes);

const PORT = process.env.NODE_PORT;

app.listen(PORT, () => {
  console.log(`Listening ${process.env.NODE_ENV} on ${process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}` : `http://${process.env.NODE_HOST}:${PORT}`}`);
});