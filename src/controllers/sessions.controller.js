import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import UserService from '../services/user.service.js';
import { createHash } from '../utils.js';
import passport from 'passport';


export default class SessionsController {
  constructor() {
    this.userService = new UserService();
  }

  register = (req, res, next) => {
    res.status(200).send({
      success: true,
      message: 'Usuario creado exitosamente.',
    });
  };

  login = (req, res, next) => {
    try {
      const userToken = {
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart,
      };
      const token = jwt.sign(userToken, config.privateKey, {
        expiresIn: '24h',
      });

      res
        .cookie(config.tokenCookieName, token, {
          maxAge: 60 * 60 * 1000 * 24,
          httpOnly: true,
        })
        .send({
          success: true,
          message: 'Inicio de sesión exitoso.',
        });
    } catch (error) {
      req.logger.error(
        `Error al iniciar sesión: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
      );
      res.status(500).send({
        success: false,
        message: 'Ocurrió un error al iniciar sesión.',
      });
    }
  };

  logout = (req, res) => {
    try {
        req.logout(); 
        res.clearCookie(config.tokenCookieName).status(200).json({
            success: true,
            message: 'Sesión cerrada exitosamente.',
        });
    } catch (error) {
        req.logger.error(
            `Error al cerrar sesión: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
        );
        res.status(500).json({
            success: false,
            message: 'Ocurrió un error al cerrar la sesión.',
        });
    }
};

  restore = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: 'Todos los campos son obligatorios.',
        });
      }

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        return res.status(401).send({
          success: false,
          message: 'Usuario no encontrado.',
        });
      }

      user.password = createHash(password);
      await this.userService.updatePassword(user);

      res.status(200).send({
        success: true,
        message: 'Contraseña actualizada exitosamente.',
      });
    } catch (error) {
      req.logger.error(
        `Error al restablecer la contraseña: ${error.message}. Método: ${req.method}, URL: ${req.url} - ${new Date().toLocaleDateString()}`
      );
      res.status(500).send({
        success: false,
        message: `Ocurrió un error al restablecer la contraseña.`,
      });
    }
  };
}
