const req = require("express/lib/request");
const Transcation = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const transcation = await Transcation.find().populate("player");
      console.log(alert);
      res.render("admin/transcation/view_transcation", {
        transcation,
        alert,
        name: req.session.user.name,
        title: "Halaman  Transcation",
      });
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/transcation");
    }
  },
  Actionstatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      await Transcation.findOneAndUpdate({ _id: id }, { status });
      req.flash(`alertMessage`, `Berhasil Ubah Status`);
      req.flash(`alertStatus`, `success`);
      res.redirect("/transcation");
    } catch (error) {
      req.flash(`alertMessage`, `${error.message}`);
      req.flash(`alertStatus`, `danger`);
      res.redirect("/transcation");
    }
  },
};
