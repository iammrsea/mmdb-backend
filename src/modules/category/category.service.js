const CategoryModel = require('./category.model');

class CategoryService {
	static getInstance() {
		return new CategoryService();
	}

	async create(category) {
		return await new CategoryModel(category).save();
	}
	async getCategories() {
		return await CategoryModel.find({});
	}
	async delete(id) {
		return await CategoryModel.findByIdAndDelete(id);
	}
}

module.exports = CategoryService;
