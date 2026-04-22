import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { UserModel } from './user.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UserService],
  imports: [TypegooseModule.forFeature([
    {
      typegooseClass: UserModel,
      schemaOptions: {
        collection: 'User'
      }
    }
  ]),
  ConfigModule],

  controllers: [UserController]
})
export class UserModule {}
