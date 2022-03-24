const req = require("express/lib/request");
const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const nominal = await Nominal.find();
      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
        name: req.session.user.name,
        title: "Halaman Nominal",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create", {
        name: req.session.user.name,
        title: "Halaman Tambah Nominal",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/nominal");
    }
  },
  ActionCreate: async (req, res) => {
    try {
      const { coinName, coinQuantity, price } = req.body;
      let nominal = await Nominal({ coinName, coinQuantity, price });
      await nominal.save();

      req.flash("alertMessage", "Berhasil tambah Nominal");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/nominal");
    }
  },
  ViewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findOne({ _id: id });
      console.log(nominal);
      res.render("admin/nominal/edit", {
        nominal,
        name: req.session.user.name,
        title: "Halaman Edit Nominal",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/nominal");
    }
  },
  ActionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinName, coinQuantity, price } = req.body;
      const nominal = await Nominal.findOneAndUpdate(
        { _id: id },
        { coinName, coinQuantity, price }
      );
      req.flash("alertMessage", "Berhasil Edit Nominal");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/nominal");
    }
  },
  ActionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findOneAndRemove({ _id: id });
      req.flash("alertMessage", "Berhasil Hapus Kategory");
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/nominal");
    }
  },
};
