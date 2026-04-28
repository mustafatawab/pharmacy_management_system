import { email, z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const verifyOtpSchemea = z.object({
    userId: z.string().min(1, "User ID is required"),
    otp: z.string().min(6, "OTP must be at least 6 characters long"),
})


export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
    token : z.string().min(1, "Token is required"),
    password: z.string().min(6, "New password must be at least 6 characters long"),
})

export const setupAccountSchema = z.object({
    token: z.string().min(1, "Token is required"),
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),

})


export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyOtpInput = z.infer<typeof verifyOtpSchemea>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type SetupAccountInput = z.infer<typeof setupAccountSchema>
