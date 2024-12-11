import "dotenv/config";

export const {
  HOSTNAME = "localhost",
  PORT = 3000,
  DATABASE_URL = "postgresql://user:password@localhost:5432/explora_peru",
  SECRET_JWT_KEY = "your_awesome_secret_key_here",
} = process.env;
