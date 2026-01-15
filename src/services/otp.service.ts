import { SendOTP } from "@/interfaces/otp.interface";
import { User } from "@/interfaces/users.interface";
import { Service } from "typedi";
import { prisma } from "@/lib/prisma";



@Service()
export class OtpService {
    private otpLength = 6;
    private otpExpiryMinutes = 1;

    public async generateOtp(phone_number: string): Promise<{ phone_number: string; otp: number }> {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString().substring(0, this.otpLength);
        const expiry = new Date(Date.now() + this.otpExpiryMinutes * 60000);

        let create;

        const existingOtp = await prisma.otp.findFirst({ where: { phone_number } });
        if (existingOtp) {
            create = await prisma.otp.update({ where: { id: existingOtp.id }, data: { otp, expiresAt: expiry } });
        } else {
            create =  prisma.otp.create({ data: { phone_number, otp, expiresAt: expiry } });
        }

        console.log(create)

        console.log(`Generated OTP for ${phone_number}: ${otp}`);

        // TODO: Send OTP via SMS provider
        return { phone_number, otp: Number(otp) };
    }

    public async verifyOtp(phone_number: string, otp: number): Promise<boolean> {
        const record = await prisma.otp.findFirst({
            where: {
                phone_number: phone_number,
                otp: String(otp),
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!record) {
            return false;
        }

        await prisma.otp.deleteMany({
            where: {
                phone_number: phone_number,
                otp: String(otp)
            }
        });

        await prisma.user.update({
            where: { phone_number: phone_number },
            data: { is_verified: true }
        });

        return true;
    }
}
