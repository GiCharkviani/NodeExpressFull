const User = require('../models/user')

exports.getlogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("619bd8f98fc91fd080263549")
  .then((user) => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err)
      res.redirect("/");
    });
  })
  .catch(console.log);
};


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err)
      res.redirect('/')
    })
};