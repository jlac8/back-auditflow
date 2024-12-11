import "dotenv/config";

export const {
  HOSTNAME = "localhost",
  PORT = 3000,
  DATABASE_URL = "postgresql://postgres:dOjyMDzZdErxADbzhtqSLOBgcLDnUdeO@autorack.proxy.rlwy.net:37761/railway",
  SECRET_JWT_KEY = "your_awesome_secret_key_here",
} = process.env;
