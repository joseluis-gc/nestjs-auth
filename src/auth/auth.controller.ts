import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';

@Controller()
export class AuthController 
{

    constructor(
        private authService:AuthService
    ){

    }

    @Post('register')
    async register(@Body() body:RegisterDTO){
        //return 'This is the register view';


        if(body.password != body.password_confirm){
            throw new BadRequestException('Password and password confirmation must match, please try again.');
        }

        //const hashed = await bcrypt.hash(body.password, 12);

        /*
        return this.authService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed,
        });
        */

        //since register.dto and user have same fields we can use this
        body.password = await bcrypt.hash(body.password, 12);
        return this.authService.create(body);

    }
}
