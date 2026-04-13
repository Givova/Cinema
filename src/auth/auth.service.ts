import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {


    constructor(
        @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>

    ) 
    

    async register(dto: any){
        return this.
    }
}
