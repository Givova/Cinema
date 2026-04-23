import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@m8a/nestjs-typegoose'
import { ActorModel } from './actor.model'
import { type ModelType } from '@typegoose/typegoose/lib/types'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		const doc = await this.ActorModel.findOne({ slug }).exec()

		if (!doc) throw new NotFoundException('Actor not found!')

		return doc
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm)
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
				],
			}

		//здесь ббудет агрегация

		return this.ActorModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async byId(_id: string) {
		const actor = await this.ActorModel.findById(_id)

		if (!actor) throw new NotFoundException('Actor not found')
		return actor
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		}

		const actor = await this.ActorModel.create(defaultValue)
		return actor._id
	}

	async update(_id: string, dto: ActorDto) {
		const updatedDoc = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()
		if (!updatedDoc) throw new NotFoundException('Actor not found')
		return updatedDoc
	}

	async delete(id: string) {
		const deletedDoc = await this.ActorModel.findByIdAndDelete(id).exec()
		if (!deletedDoc) throw new NotFoundException('Actor not found')
		return deletedDoc
	}
}
