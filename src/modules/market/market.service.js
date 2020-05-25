const Market = require('./market.model');
const { throwError } = require('../../utils');
const CursorService = require('../cursor/cursor.service');
const DataTransformer = require('../data-transformer/transformation.service');
const ImageService = require('../image/image.service');

class MarketService {
	constructor(isUserAuth) {
		this.isUserAuth = isUserAuth;
	}
	async create(market) {
		if (!this.isUserAuth) throwError('Unauthorized operation');

		try {
			const { files, body } = market;
			const images = files.map((file) => ({
				file: file.buffer,
				fileName: file.originalname,
			}));

			const imageService = ImageService.getInstance();
			const requestPromises = images.map((image) => imageService.uploadImage(image));
			const results = await Promise.all(requestPromises);
			const savedImages = await imageService.saveToDatabase(results);

			const _market = new Market({
				address: body.address,
				name: body.name,
				description: body.description,
				foodCategory: body.foodCategory,
				location: {
					type: 'Point',
					coordinates: [+body.long, +body.lat],
				},
				images: savedImages.map((image) => image._id),
			});

			const savedMarket = await _market.save();
			return savedMarket;
		} catch (e) {
			return throwError(e);
		}
	}

	async search(searchText) {
		await Market.createIndexes();
		// console.log(await Market.listIndexes());
		try {
			let query = Market.find({ $text: { $search: searchText } });
			return await query.populate('images').exec();
		} catch (error) {
			return throwError(error);
		}
	}
	async nearestMarket(coordinates) {
		// await Market.createIndexes();
		try {
			coordinates = [+coordinates[0], +coordinates[1]];
			const METRES_PER_MILE = 1609.34;
			let query = Market.find({
				location: {
					$nearSphere: { $geometry: { type: 'Point', coordinates }, $maxDistance: 5000 * METRES_PER_MILE },
				},
			});
			const results = await query.populate('images').exec();

			return results[0];
		} catch (error) {
			return throwError(error);
		}
	}
	async delete(id) {
		if (!this.isUserAuth) return throwError('Unauthorized operation');
		try {
			await Market.findByIdAndDelete(id);
			return { success: true };
		} catch (e) {
			return throwError(e);
		}
	}
	async getMarkets({ first, after }) {
		try {
			const cursorService = CursorService.getInstance();
			let limit = first > 20 || !first ? 20 : first;
			let _after = cursorService.decode(after);
			const query = Market.find({});

			if (_after) {
				query.gte('_id', _after);
			}
			query.sort({ _id: 'desc' }).limit(limit + 1);
			const markets = await query.exec();
			const options = [{ path: 'images', select: 'url thumbnailUrl fileId name' }];
			const data = await Market.populate(markets, options);

			const transformer = DataTransformer.getInstance();

			const result = transformer.transform({ data, limit });
			return result;
		} catch (error) {
			return throwError(error);
		}
	}
	async createBulk(markets) {
		return await Market.insertMany(markets);
	}
	async getMarket(id) {
		return await Market.findById(id).populate('images');
	}
	async update({ id, files, body }) {
		if (!this.isUserAuth) return throwError('Unauthorized operation');

		try {
			return await Market.findOneAndUpdate({ _id: id }, body, {
				upsert: true,
				new: true,
				useFindAndModify: false,
			}).populate('images');
		} catch (error) {
			return throwError(error);
		}
	}
	async updateImage({ id, file, body }) {
		if (!this.isUserAuth) return throwError('Unauthorized operation');

		try {
			const image = { file: file.buffer, fileName: file.originalname };
			const imageService = ImageService.getInstance();

			const newImage = await imageService.uploadImage(image);

			const updatedImage = await imageService.updateImage(newImage, body._id);

			await imageService.deleteImage(body.fileId);

			return updatedImage;
		} catch (error) {
			return throwError(error);
		}
	}
	static getInstance(isUserAuth) {
		return new MarketService(isUserAuth);
	}
}

module.exports = MarketService;
