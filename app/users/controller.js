const req = require("express/lib/request");
const User = require("./model");
const bcrypt = require("bcrypt");

module.exports = {
  viewsignIn: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      console.log(alert);
      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signin", {
          alert,
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/");
    }
  },

  ActionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await User.findOne({ email: email });
      if (check) {
        if (check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);
          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              status: check.status,
              name: check.name,
            };
            res.redirect("/dashboard");
          } else {
            req.flash(`alertMessage`, `Password salah`);
            req.flash(`alertStatus`, `danger`);
            res.redirect("/");
          }
        } else {
          req.flash(`alertMessage`, `Status Belum Aktif`);
          req.flash(`alertStatus`, `danger`);
          res.redirect("/");
        }
      } else {
        req.flash(`alertMessage`, `Email Yang anda Masukan salah`);
        req.flash(`alertStatus`, `danger`);
        res.redirect("/");
      }
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/");
    }
  },
  ActionLogout: async (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
