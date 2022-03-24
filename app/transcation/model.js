const mongoose = require("mongoose");
let transcationSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, "Nama game harus di isi"] },
      category: { type: String, require: [true, "Category game harus di isi"] },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, "Nama coin harus di isi"] },
      coinQuantity: {
        type: String,
        require: [true, "Jumlah Coin harus di isi"],
      },
      price: { type: Number },
    },
    historyPayment: {
      name: { type: String, require: [true, "Nama harus di isi"] },
      type: { type: String, require: [true, "Type harus di isi"] },
      Bankname: { type: String, require: [true, "Nama Bankharus di isi"] },
      noRekening: { type: String, require: [true, "No Rekening harus di isi"] },
    },
    name: {
      type: String,
      require: [true, "Nama harus di isi"],
      maxlength: [225, "Panjang Nama Harus 5 -255 Karakter"],
      minlength: [5, "Panjang Nama Harus 5 -255 Karakter"],
    },
    accountUser: {
      type: String,
      require: [true, "Nama Akun harus di isi"],
      maxlength: [225, "Panjang Nama Harus 5 -255 Karakter"],
      minlength: [5, "Panjang Nama Harus 5 -255 Karakter"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, require: [true, "Nama harus di isi"] },
      phoneNumber: {
        type: Number,
        require: [true, "Nama Akun harus di isi"],
        maxlength: [13, "Panjang Nama Harus 9 -13 Karakter"],
        minlength: [9, "Panjang Nama Harus 9 -13 Karakter"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transcation", transcationSchema);
