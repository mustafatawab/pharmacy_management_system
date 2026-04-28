import "dotenv/config"

import { z } from "zod"


const envSchema = z.object({
    PORT : z.string().default("9000"),
    DATABASE_URL : z.string().min(1, "DATABASE_URL is required"),
    JWT_SECRET : z.string().min(1, "JWT_SECRET is required"),
    JWT_REFRESH_SECRET : z.string().min(1, "JWT_REFRESH_SECRET is required"),
    ACCESS_TOKEN_EXPIRE_MINUTES : z.string().default("30"),

})



const parsed = envSchema.safeParse(process.env);


if (!parsed.success) {
    console.error("Invalid environment variables", parsed.error.format())
    process.exit(1)
}

export const env = parsed.data