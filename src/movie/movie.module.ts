import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MovieService } from './movie.service'
import { TypegooseModule } from '@m8a/nestjs-typegoose'
import { MovieModel } from './movie.model'
import { MovieController } from './movie.controller'
import { TelegramModule } from 'src/telegram/telegram.module'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie',
				},
			},
		]),
		ConfigModule,
		TelegramModule,
	],
	providers: [MovieService],
	controllers: [MovieController],
	exports: [MovieService],
})
export class MovieModule {}
