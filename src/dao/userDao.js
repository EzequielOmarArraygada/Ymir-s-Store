import userModel from './models/user.model.js';

export default class UserDao {
  constructor() {
    this.userModel = userModel;
  }

  async get() {
    return await this.userModel.find();
  }

  async getBy(email) {
    return await this.userModel.findOne({ email });
  }

  async create(newUser) {
    return await this.userModel.create(newUser);
  }

  async updatePassword(user) {
    return await this.userModel.updateOne(
      { email: user.email },
      { password: user.password }
    );
  }
}
