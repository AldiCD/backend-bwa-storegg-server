const req = require("express/lib/request");
const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const bank = await Bank.find();
      console.log(alert);
      res.render("admin/bank/view_bank", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Halaman Bank",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create", {
        name: req.session.user.name,
        title: "Halaman Tambah Bank",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/bank");
    }
  },
  ActionCreate: async (req, res) => {
    try {
      const { name, nameBank, noRekening } = req.body;
      let bank = await Bank({ name, nameBank, noRekening });
      await bank.save();

      req.flash("alertMessage", "Berhasil tambah Bank");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/bank");
    }
  },
  ViewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      console.log(bank);
      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Halaman Edit Bank",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/bank");
    }
  },
  ActionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, nameBank, noRekening } = req.body;
      const bank = await Bank.findOneAndUpdate(
        { _id: id },
        { name, nameBank, noRekening }
      );
      req.flash("alertMessage", "Berhasil Edit Kategory");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/bank");
    }
  },
  ActionDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOneAndRemove({ _id: id });
      req.flash("alertMessage", "Berhasil Hapus Kategory");
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/bank");
    }
  },
};
