const crypto = require("crypto");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getlogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch(() => {
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        });
    })
    .catch(console.log);
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email exists already, please pick a different one");
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "gi.charkviani@gmail.com",
            subject: "signup successed",
            html: "<h1>Your successfully signed up!</h1>",
          });
        })
        .catch(console.log);
    })
    .catch(console.log);
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) return res.redirect("/");
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        }
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: req.body.email,
          from: "gi.charkviani@gmail.com",
          subject: "Password reset",
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch(console.log);
  });
};

exports.getNewPassword = (req, res, next) => {

  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
  
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(console.log)

}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()},_id: userId})
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = null;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save()
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(console.log)
}