const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HASD_ROUND = 10;
let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email Harus Diisi"],
    },
    name: {
      type: String,
      require: [true, "Nama  Harus Diisi"],
      maxlength: [225, "Panjang Nama Harus 5 -255 Karakter"],
      minlength: [5, "Panjang Nama Harus 5 -255 Karakter"],
    },
    username: {
      type: String,
      require: [true, "Nama  Harus Diisi"],
      maxlength: [225, "Panjang Nama Harus 5 -255 Karakter"],
      minlength: [5, "Panjang Nama Harus 5 -255 Karakter"],
    },
    password: {
      type: String,
      require: [true, "Password Harus Diisi"],
      maxlength: [225, "Panjang Nama Harus 8 -255 Karakter"],
      minlength: [8, "Panjang Nama Harus 8 -255 Karakter"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    avatar: {
      type: String,
    },
    filename: {
      type: String,
    },
    phoneNumber: {
      type: String,
      require: [true, "Nomor Harus Diisi"],
      maxlength: [13, "Panjang Nama Harus 9 -13 Karakter"],
      minlength: [9, "Panjang Nama Harus 9 -13 Karakter"],
    },
    favorit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);
playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASD_ROUND);
  next();
});
module.exports = mongoose.model("Player", playerSchema);
