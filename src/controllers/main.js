const bcryptjs = require('bcryptjs');
const { render } = require('express/lib/response');
const db = require('../database/models');

const mainController = {
  home: async (req, res) => {
    // db.Book.findAll({
    //   include: [{ association: 'authors' }]
    // })
    //   .then((books) => {
    //     res.render('home', { books });
    //   })
    //   .catch((error) => console.log(error));
    try {
      const books = await db.Book.findAll({
        include: 'authors'
      })
      res.render('home', { books });
      // console.log(books)
    } catch (error) {
      console.log(error)
    }
  },
  bookDetail: async (req, res) => {
    // Implement look for details in the database
    //desclaro una const book: se guarda la eticion de base de datos
    //usamos el metodo Primarykey para buscar en la (db) datavalius y si la encuentra la muestra

    const id = req.params.id
    try {
      const book = await db.Book.findOne({
        where: { id },
        include: 'authors'
      })
      // const autor = await db.BooksAuthors.findOne({
      // where: { BookId: id }
      // })
      // console.log(db)
      //throw new Error ('no se encontro el libro')
      // db.Book.findByPk(req.params.id)
      // .the(datos => {
      //   // res.json(datos)
      //   res.render('bookDetail');
      // })
      res.render('bookDetail', { book: book.dataValues });
    } catch (error) {
      console.log(error)
    }
    // res.render('bookDetail');
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: async (req, res) => {
    // Implement search by title
    // llega el titulo del front
    const title = req.body.title.toLowerCase()
    // console.log(req.body.title)
    try {
      // se trae tods los libros
      const libros = await db.Book.findAll();
      // creamos una const y filtrar y comparar los textos de front y lo incluimos y filtaramos y devolvimos
      const books = libros.filter(libro => libro.dataValues.title.toLowerCase().includes(title))
      console.log(res)
      res.render('search', { books });
    } catch (error) {
      console.log(error)
    }
    // console.log(req.body.title)
    // db.book.findAll(req.params.id)
    // .then(datos => {
    //   res.render('search', {data:datos})  

    //   for (let i = 0; i < datos.length; i++) {
    //     const element = datos[i].title;
    //     return element
    //   }
    //   res.render('search', {data:element})

    //   if(titel == element) {
    //     res.render('search', {data:element})

    //   }else{
    //     res.send('Libro no encontrado')
    //   }
    // }) 
    res.render('search');
  },
  deleteBook: async (req, res) => {
    // Implement delete book
    // npm install method - override

    const id = req.params.id
    // console.log(id)
    try {
      const borrar = await db.Book.destroy(
        {
          where: { id }, force: true
        }
      )
      res.redirect('/')
    } catch (error) {

      console.log(error)
    }
    // .then(() => {
    //   res.redirect("home")
    // })
    // const books = await db.Book.findAll()
    // console.log(id)
    // this.deleteBook(req, res)
    // db.Book.borrar({
    //   where: {
    //     id: req.params.id
    //   }
    // })
    // res.render('home', { books });

    // delete: (req, res) => {
    //   db.user.destroy({
    //     where: {
    //       id: req.params.id
    //     }
    //   })
    //     .then(() => {
    //       res.redirect("/home")
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // }

  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: async (req, res) => {
    // Implement books by author
    // buscado el authors por id
    const id = req.params.id
    try {
      const books = await db.Author.findOne({
        where: {
          id: id
        },
        include: 'books'
      })
      // console.log(books.dataValues.books)
      res.render('authorBooks', { books: books.dataValues.books });
    } catch (error) {
      console.log(error)
    }
    // res.render('authorBooks', { autor: autor });
    // const id = db.Author.findByPk(id)
    // .then()
    // console.log(id)
    // res.render('authorBooks');
    // db.Book.findByPk(req.params.id)
    //   .then(datos => {

    //     res.render('authorBooks', { data: datos });

    //     console.log(datos)
    //   })
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login', { error: '' })






    // db.User.name
    // db.User.email

    // if (req.cookies.idToken) {
    //   await db.User.destroy({
    //     where: { token: req.cookies.idToken },
    //     force: true,
    //   });
    // }
    // // Destruimos la sesión
    // req.login.destroy();

    // // Destruimos la cookie de recordar
    // res.clearCookie("idToken");
    // // res.render('home');


    // res.render('login');
  },
  processLogin: async (req, res) => {
    // Implement login process
    //Extarigo el email y password que se entrudujo en tu vista body!
    const email = req.body.email;
    const password = req.body.password;
    //consulta nuestra base de datos si existe el email
    //Try cathc para manejar codigo asincrono
    // console.log(email)
    // console.log(password)
    try {
      // email = marinoosanz@gmail.com
      const usuario = await db.User.findOne({ where: { email: email } })
      console.log(usuario)
      // verifica si ese email existe
      if (!usuario) {
        res.render('login', {
          error: 'No hay un usuario con ese email',

        });
      }
      // verificar si la contraseña es valida
      bcryptjs.compare(password, usuario.dataValues.Pass, async (error, resultado) => {
        if (!resultado) {
          res.render('login', {
            error: 'La contraseña es incorrecta',

          });
        }
        if (resultado) {
          const books = await db.Book.findAll({
            include: 'authors'
          })
          res.render('home', { books });
        }
      });

      // let admin = await db.User.findByPk(req.params.id);
      // await db.User.update(
      //   {
      //     categoryId:
      //       if (id === 1) {
      //         userEdit.Id = 2,
      //         userEdit.Id = 1,
      //   },
      //   {
      //     where: { id: req.params.id },
      //   }
      // );

    } catch (error) {
      console.log(error);
    }
    // res.render('home');
  },
  edit: async (req, res) => {
    // Implement edit book
    // trae el libro
    const id = req.params.id
    try {
      const book = await db.Book.findByPk(id)
      res.render('editBook', { id, book: book.dataValues })
    } catch (error) {
      console.log(error)
    }

  },
  processEdit: async (req, res) => {
    // Implement edit book
    // capturamos id 
    const id = req.params.id
    try {
      // buscamos
      // const book = await db.Book.findByPk(id)
      // actualiza
      // const resultado = await book.update(req.body)
      await db.Book.update(req.body, { where: { id: id } })

      const books = await db.Book.findOne({
        where: {
          id: id
        },
        include: 'authors'
      })
      // console.log(resultado)
      res.render('bookDetail', { book: books.dataValues });
    } catch (error) {
      console.log(error)
    }

  }

};

module.exports = mainController;
