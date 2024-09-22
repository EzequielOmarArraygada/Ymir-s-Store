import UserDao from '../dao/userDao.js';

export default class UserService {
  constructor() {
    this.userDao = new UserDao();
  }

  getUsers = async () => {
    try {
      return await this.userDao.get();
    } catch (error) {
      return Promise.reject('Error ' + error);
    }
  };

  getUserByEmail = async (email) => {
    try {
      return await this.userDao.getBy(email);
    } catch (error) {
      return Promise.reject('Error ' + error);
    }
  };

  createUser = async (newUser) => {
    try {
      return await this.userDao.create(newUser);
    } catch (error) {
      return Promise.reject('Error ' + error);
    }
  };

  updatePassword = async (user) => {
    try {
      return await this.userDao.updatePassword(user);
    } catch (error) {
      return Promise.reject('Error' + error);
    }
  };
}
