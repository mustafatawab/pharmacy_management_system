import jwt , {SignOptions} from "jsonwebtoken";
import { env } from "../../config/env";

export interface TokenPayload {
    userId : number
    email : string
}


export const generateAccessToken = (payload : TokenPayload , expiresIn : SignOptions["expiresIn"]) : string => {
    return jwt.sign(payload , env.JWT_SECRET , {expiresIn})
}


export const generateRefreshToeken = (payload : TokenPayload , expiresIn : SignOptions["expiresIn"]) : string => {
    return jwt.sign(payload , env.JWT_REFRESH_SECRET , {expiresIn})
}


export const verifyAccessToken = (token : string) : TokenPayload => {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}


export const verifyRefreshToken = (token : string) : TokenPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}