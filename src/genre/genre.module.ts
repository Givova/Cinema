import { Module } from '@nestjs/common'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { TypegooseModule } from '@m8a/nestjs-typegoose'
import { ConfigModule } from '@nestjs/config'
import { GenreModel } from './genre.model'

@Module({
	controllers: [GenreController],
	providers: [GenreService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre',
				},
			},
		]),
		ConfigModule,
	],
})
export class GenreModule {}
