import { Module } from '@nestjs/common'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'
import { TypegooseModule } from '@m8a/nestjs-typegoose'
import { RatingModel } from './rating.model'
import { MovieModule } from 'src/movie/movie.module'

@Module({
	controllers: [RatingController],
	providers: [RatingService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: RatingModel,
				schemaOptions: {
					collection: 'Rating',
				},
			},
		]),
		MovieModule,
	],
})
export class RatingModule {}
