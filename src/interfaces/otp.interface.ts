import { Request } from 'express';

export interface SendOTP {
    phone_number: string
    otp: number
}

export interface RequestWithOTP extends Request {
    phone_number: string
}

export interface VerifyOTP extends Request {
    phone_number: string
    otp: number
}