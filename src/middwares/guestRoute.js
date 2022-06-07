// si hay un usuario en session lo manda a home

module.exports = (req, res, next) => {
    // si existe un usuario logueado
    if (req.session.user) {
        // Lo dejamos pasar
        res.redirect("/");

    } else {
        // si no lo de pasar 
        next();
    }
};