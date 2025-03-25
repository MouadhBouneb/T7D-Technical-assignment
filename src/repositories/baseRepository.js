class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findOne({ _id: id });
  }

  async findOne(filter) {
    return await this.model.findOne({ ...filter });
  }

  async findAll(filter = {}) {
    return await this.model.find({ ...filter });
  }

  async update(id, data) {
    data.updatedAt = new Date();
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments({ ...filter });
  }

  async findWithPagination(filter = {}, page = 1, limit = 10, sort = {}) {
    const skip = (page - 1) * limit;
    const total = await this.count(filter);
    const data = await this.model
      .find({ ...filter })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = BaseRepository;
