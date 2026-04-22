// import { Injectable } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose'
import { Injectable, NotFoundException } from '@nestjs/common'
// import { UserModel } from './user.model'
import { type ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from 'src/auth/dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'
import { GenreModel } from './genre.model'
import { CreateGenreDto } from './dto/create-genre.dto'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async bySlug(slug: string) {
		return this.GenreModel.findOne({ slug }).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
					{ description: new RegExp(searchTerm, 'i') },
				],
			}
		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async getCollections() {
		const genres = await this.getAll()
		const collections = genres
		return collections
	}

	/*Admin place */

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) throw new NotFoundException('Genre not found')
		return genre
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updatedGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()
		if (!updatedGenre) throw new NotFoundException('Genre not found')
		return updatedGenre
	}

	// async getCount() {
	// 	return this.GenreModel.countDocuments().exec() // было find().count().exec()
	// }

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}

		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async delete(id: string) {
		const deletedDoc = await this.GenreModel.findByIdAndDelete(id).exec()
		if (!deletedDoc) throw new NotFoundException('Genre not found')
		return deletedDoc
	}
}
