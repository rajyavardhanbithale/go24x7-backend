import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { prisma } from "@/lib/prisma";

@Service()
export class UserService {
  public user = prisma.user;


}
