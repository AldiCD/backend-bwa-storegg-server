const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Nominal = require("../nominal/model");
const Transcation = require("../transcation/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .populate("category")
        .select("_id name status category thumbnail");
      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phone number");
      if (!voucher) {
        return res.status(404).json({ message: "Voucher Game tidak temukan" });
      }
      res.status(200).json({ data: voucher });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({ data: category });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },

  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;
      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");
      if (!res_voucher)
        return res
          .status(404)
          .json({ massage: "Voucher Game Tidak Di Temukan" });

      const res_nominal = await Nominal.findOne({ _id: nominal });
      if (!res_nominal)
        return res.status(404).json({ massage: "Nominal Tidak Di Temukan" });

      const res_payment = await Payment.findOne({ _id: payment });
      if (!res_payment)
        return res.status(404).json({ massage: "Payment Tidak Di Temukan" });

      const res_bank = await Bank.findOne({ _id: bank });
      if (!res_bank)
        return res.status(404).json({ massage: "Bank Tidak Di Temukan" });
      let tax = (5 / 100) * res_nominal._doc.price;
      let value = res_nominal._doc.price - tax;

      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          category: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : " ",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          Bankname: res_bank._doc.bankName,
          noRekening: res_bank._doc.noRekening,
        },

        name: name,
        accountUser: accountUser,
        tax: tax,
        value: value,

        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user?._id,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },
        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };
      const transcation = new Transcation(payload);
      await transcation.save();
      res.status(200).json({ data: payload });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },
  history: async (req, res) => {
    try {
      const { status = "" } = req.query;
      let critiria = {};

      if (status.length) {
        critiria = {
          ...critiria,
          status: { $regex: `${status}`, $options: "1" },
        };
      }

      if (req.player._id) {
        critiria = {
          ...critiria,
          player: req.player._id,
        };
      }

      const history = await Transcation.find(critiria);
      let total = await Transcation.aggregate([
        { $match: critiria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);
      res.status(200).json({ data: history, total: total[0].value });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const history = await Transcation.findOne({ _id: id });

      if (!history)
        res.status(404).json({ massage: "history tidak di temukan" });
      res.status(200).json({ data: history });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transcation.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);
      const category = await Category.find({});
      category.forEach((element) => {
        count.forEach((data) => {
          if (data._id.toString() === element._id.toString()) {
            data.name = element.name;
          }
        });
      });

      const history = await Transcation.find({ player: req.player._id })
        .populate("category")
        .sort({ updateAt: -1 });

      res.status(200).json({ data: history, count });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        id: req.player._id,
        name: req.player.name,
        username: req.player.usermame,
        email: req.player.email,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      };
      res.status(200).json({ data: player });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Terjadi Kesalahan Pada Server" });
    }
  },editProfile: async (req, res, next) => {
    try {
      const { name = "", phoneNumber = "" } = req.body

      const payload = {}

      if (name.length) payload.name = name
      if (phoneNumber.length) payload.phoneNumber = phoneNumber

      if (req.file) {

        let tmp_path = req.file.path;
        let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        let filename = req.file.filename + '.' + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

        const src = fs.createReadStream(tmp_path)
        const dest = fs.createWriteStream(target_path)

        src.pipe(dest)

        src.on('end', async () => {
          let player = await Player.findOne({ _id: req.player._id })

          let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }

          player = await Player.findOneAndUpdate({
            _id: req.player._id
          }, {
            ...payload,
            avatar: filename
          }, { new: true, runValidators: true })

          console.log(player)

          res.status(201).json({
            data: {
              id: player.id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            }
          })
        })

        src.on('err', async () => {
          next(err)
        })

      } else {
        const player = await Player.findOneAndUpdate({
          _id: req.player._id
        }, payload, { new: true, runValidators: true })

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          }
        })
      }

    } catch (err) {
      if (err && err.name === "ValidationError") {
        res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors
        })
      }
    }
  }


};
