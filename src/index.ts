import cors from "cors";
import express, { type Request, type Response } from "express";
import morgan from "morgan";
import { HOSTNAME, PORT } from "./config";
import authRouter from "./routes/auth.routes";
import profileRouter from "./routes/profile.routes";
import auditsRoutes from "./routes/audits.routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

morgan.token("body", (req: Request) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const welcomeListener = (_req: Request, res: Response) => {
  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .send(
      `<h1>AuditFlow API 🚀</h1>
    <p>This is the backend of the AuditFlow project.</p>`
    );
};

app.get("/", welcomeListener);
app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api/audits", auditsRoutes);

app.listen(PORT, () => {
  console.log(`✅ AuditFlow API is running on http://${HOSTNAME}:${PORT}`);
});

export default app;
