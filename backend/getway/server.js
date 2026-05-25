import express from "express"
import dotenv from "dotenv"
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from "cors"
const app = express()

dotenv.config()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',createProxyMiddleware({
    target:"http://localhost:5001",
       changeOrigin: true,
    ws: true,
}))

app.use('/socket',createProxyMiddleware({
    target:"http://localhost:5002",
       changeOrigin: true,
    ws: true,
}))




app.listen(8000, () => {
  console.log("API Gateway running on port 8000");
});