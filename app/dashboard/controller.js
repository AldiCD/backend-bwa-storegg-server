const Transcation = require("../transcation/model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Player = require("../player/model");

module.exports = {
  index: async (req, res) => {
    try {
      const transcation = await Transcation.countDocuments();
      const voucher = await Voucher.countDocuments();
      const category = await Category.countDocuments();
      const players = await Player.countDocuments();

      res.render("admin/dashboard/view_dashboard", {
        name: req.session.user.name,
        title: "Halaman Dashboard",
        transcation,
        voucher,
        category,
        players,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
