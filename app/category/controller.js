const req = require("express/lib/request");
const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();
      console.log(alert);
      res.render("admin/category/view_category", {
        category,
        alert,
        name: req.session.user.name,
        title: "Halaman Category",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/category");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", {
        name: req.session.user.name,
        title: "Halaman Categoryw",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/category");
    }
  },
  ActionCreate: async (req, res) => {
    try {
      const { name } = req.body;
      let category = await Category({ name });
      await category.save();

      req.flash("alertMessage", "Berhasil tambah Kategory");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/category");
    }
  },
  ViewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      console.log(category);
      res.render("admin/category/edit", {
        category,
        name: req.session.user.name,
        title: "Halaman Categoryw",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/category");
    }
  },
  ActionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await Category.findOneAndUpdate(
        { _id: id },
        { name: name }
      );
      req.flash("alertMessage", "Berhasil Edit Kategory");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/category");
    }
  },
  ActionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOneAndRemove({ _id: id });
      req.flash("alertMessage", "Berhasil Hapus Kategory");
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/category");
    }
  },
};
