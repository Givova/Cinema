import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypegooseModule } from 'node_modules/@m8a/nestjs-typegoose/dist';
import { UserModel } from 'src/user/user.model';
import { ConfigModule } from 'node_modules/@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [TypegooseModule.forFeature([
    {
      typegooseClass: UserModel,
      schemaOptions: {
        collection: 'User'
      }
    }
  ]),
  ConfigModule,
],
  providers: [AuthService],
})
export class AuthModule {}
