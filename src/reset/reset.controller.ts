import { Body, Controller, Post } from '@nestjs/common';

@Controller()
export class ResetController {
    
    @Post('forgot')
    async forgot(@Body('email') email:string){//sending email as a string

        

    }
}
