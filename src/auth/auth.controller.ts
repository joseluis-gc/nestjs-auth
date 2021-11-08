import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthInterceptor } from './auth.interceptor';
//import { Request } from 'http';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController 
{

    constructor(
        private authService:AuthService,
        private jwtService:JwtService
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


    @Post('login')
    async login(
        @Body('email') email:string,
        @Body('password') password:string,
        @Res({passthrough:true})response:Response
    )
    {
        //go to auth services to register service findoneby
        const user = await this.authService.findOneBy({email});

        if(!user){
            throw new BadRequestException('Email does not exist.')
        }

        if(!await bcrypt.compare(password, user.password)){
            throw new BadRequestException('Invalid login credentials.');
        }

        //create token
        const jwt = await this.jwtService.signAsync({id:user.id})

        response.cookie('jwt', jwt, {httpOnly:true});

        return user;

    }


    @UseInterceptors(AuthInterceptor)
    @Get('user')
    async user(
        @Req() request: Request
    ){
        const cookie = request.cookies['jwt'];

        const data = await this.jwtService.verifyAsync(cookie);

        const user = await this.authService.findOneBy({id: data['id']});


        return user
    }




    @UseInterceptors(AuthInterceptor)
    @Post('logout')
    async logout(
        @Res({passthrough:true})response:Response
    ){

        response.clearCookie('jwt');

        return{
            message: 'Success'
        }
    }

}
