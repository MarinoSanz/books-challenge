const db = require("../database/models");

module.exports = async (req, res, next) => {
    // Por defecto el usuario no está logeado
    res.locals.user = false;

    // Si hay un user en session
    if (req.session && req.session.user) {
        // Se lo pasamos a la vista, por medio de la variable locals
        res.locals.user = req.session.user;

        return next();

        // O si el usuario pidio que lo recuerde, tendremos la cookie con el token
    } else if (req.cookies && req.cookies.user) {
        req.session.user = req.cookies.user;
        res.locals.user = req.cookies.user;
    }

    next();
};

// try {
//     const userToken = await db.UserLog.findOne({
//         where: { token: req.cookies.rememberToken },
//     });

//     // y existe el token en nuestra base
//     if (userToken) {
//         let user = await db.User.findOne({ where: { id: userToken.userId } });

//         // y existe el usuario en nuestra base
//         if (user) {
//             delete user.dataValues.password;

//             // Se lo pasamos a la sesión a la vista

//         }
//     }
// } catch (error) {
//     console.log(error);
// }