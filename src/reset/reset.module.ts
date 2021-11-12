import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { ResetEntity } from './reset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([ResetEntity]),
  ],
  providers: [ResetService],
  controllers: [ResetController]
})
export class ResetModule {}
