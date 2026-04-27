import { InjectModel } from '@m8a/nestjs-typegoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { UserModel } from './user.model'
import { type ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from 'src/auth/dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async byId(_id: string) {
		const user = await this.UserModel.findById(_id)

		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)

		const isSameUser = await this.UserModel.findOne({ email: dto.email })

		if (isSameUser && String(_id) !== String(isSameUser._id))
			throw new NotFoundException('Email busy')

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		if (dto.email) {
			user.email = dto.email
		} // заменил с if(dto.email) user.email = dto.email на if (dto.email) {
		if (dto.isAdmin || dto.isAdmin === false) user.isAdmin = dto.isAdmin

		await user.save()
		return
	}

	async getCount() {
		return this.UserModel.countDocuments().exec() // было find().count().exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [{ email: new RegExp(searchTerm, 'i') }],
			}
		return this.UserModel.find(options)
			.select('-password -updatedAt -__v')
			.sort({ createdAt: -1 })
			.exec()
	}

	async deleteUser(id: string) {
		return this.UserModel.findByIdAndDelete(id).exec()
	}

	async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
		const { _id, favorites } = user
		// const safeFavorites = favorites ?? []

		await this.UserModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId)
				? favorites.filter((id) => String(id) !== String(movieId))
				: [...favorites, movieId],

			// favorites: safeFavorites.includes(movieId)
			// ? safeFavorites.filter((id) => String(id) !== String(movieId))
			// : [...safeFavorites, movieId],
		})
	}

	async getFavoriteMovies(_id: Types.ObjectId) {
		return this.UserModel.findById(_id, 'favorites')
			.populate({ path: 'favorites', populate: { path: 'genres' } })
			.exec()
			.then((data) => data.favorites)
	}
}
