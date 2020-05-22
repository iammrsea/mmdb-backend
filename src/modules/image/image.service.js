const ImageKit = require('imagekit');
const ImageModel = require('./image.model');

class ImageService {
	constructor() {
		const uploader = new ImageKit({
			publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
			privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
			urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id/',
		});
		this._uploader = uploader;
	}

	uploadImage({ file, fileName }) {
		return new Promise((resolve, reject) => {
			this._uploader.upload(
				{
					file,
					fileName,
				},
				(error, result) => {
					if (error) reject(error);
					resolve(result);
				}
			);
		});
	}
	deleteImage(fileId) {
		return new Promise((resolve, reject) => {
			this._uploader.deleteFile(fileId, (error, result) => {
				if (error) reject(error);
				resolve(result);
			});
		});
	}
	async saveToDatabase(images) {
		return await ImageModel.insertMany(images);
	}
	async updateImages(images, ids) {
		const promises = images.map((image, i) => {
			return ImageModel.findOneAndUpdate({ _id: ids[i] }, image, {
				upsert: true,
				new: true,
				useFindAndModify: false,
			});
		});
		return await Promise.all(promises);
	}
	static getInstance() {
		return new ImageService();
	}
}

module.exports = ImageService;
