import config from '../config/config.js';
import ProductController from './product.controller.js';

export default class ViewsController {
  constructor() {
    this.productController = new ProductController();
  }

  renderInicio = (req, res) => {
    res.redirect('/login');
  };

  renderChat = (req, res) => {
    res.render('chat', { title: 'Chat' });
  };

  renderLogin = (req, res) => {
    res.render('login', { title: 'Login' });
  };

  renderRegister = (req, res) => {
    res.render('register', { title: 'Registro' });
  };

  renderRestore = (req, res) => {
    res.render('restore');
  };

  renderCurrent = (req, res) => {
    if (req.cookies[config.tokenCookieName]) {
      res.render('current', { title: 'Perfil de usuario', user: req.user });
    } else {
      res.status(401).json({
        error: 'Token de autenticación inválido.',
      });
    }
  };

  renderProducts = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect('/login');
    }
    const params = req.query;
    const user = req.user;
    const urlParams = new URLSearchParams(params);
    const url = `http://localhost:8080/api/products?${urlParams.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          res.render('products', {
            data,
            title: 'Listado de productos',
            user,
          });
        } else {
          req.logger.error(
            `Error al obtener los productos: ${data.error || 'Datos no disponibles'}. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
          );
          res.status(500).send('Hubo un problema al obtener la lista de productos.');
        }
      })
      .catch((error) => {
        req.logger.error(
          `Error al realizar la solicitud de productos: ${error.message}. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        );
        res.status(500).send(`Error en la solicitud de productos. ${error.message}`);
      });
  };

  renderCart = (req, res) => {
    if (!req.cookies[config.tokenCookieName]) {
      return res.redirect('/login');
    }
    const cid = req.params.cid;
    fetch(`http://localhost:8080/api/carts/${cid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const products = data.payload.products;
          res.render('carts', { products, title: 'Carrito' });
        } else {
          req.logger.error(
            `Error al acceder al carrito: ${data.error || 'Datos no disponibles'}. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
          );
          res.status(500).send('Hubo un problema al acceder al carrito.');
        }
      })
      .catch((error) => {
        req.logger.error(
          `Error al realizar la solicitud del carrito: ${error.message}. ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`
        );
        res.status(500).send(`Error en la solicitud del carrito. ${error.message}`);
      });
  };
}
