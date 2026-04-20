import { InjectModel } from "@m8a/nestjs-typegoose";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { type ModelType } from "@typegoose/typegoose/lib/types";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "src/user/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( private readonly configService: ConfigService, 
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET') ?? 'secret'// Не так как в видео было)
        })
    }

    async validate({_id}: Pick<UserModel, '_id'>){
        return this.UserModel.findById(_id).exec()
    }
}