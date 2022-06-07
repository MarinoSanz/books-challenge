const express = require('express');
const mainController = require('../controllers/main');
const guestRoute = require('../middwares/guestRoute')


const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
// evita que halla un usuario logueado entre a registrase
router.get('/users/register', guestRoute, mainController.register);
router.post('/users/register', mainController.processRegister);
// evita que halla un usuario logueado entre a login
router.get('/users/login', guestRoute, mainController.login);
router.post('/users/login', mainController.processLogin);
router.delete('/books/:id', mainController.deleteBook);
router.get('/books/edit/:id', mainController.edit);
router.post('/books/edit/:id', mainController.processEdit);
// se crea ruta 
router.post('/users/logout', mainController.logout)


module.exports = router;
