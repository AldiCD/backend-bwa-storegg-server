const mongoose = require("mongoose");
let userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama  Harus Diisi"],
    },
    email: {
      type: String,
      require: [true, "Email Harus Diisi"],
    },
    password: {
      type: String,
      require: [true, "Password Harus Diisi"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    phoneNumber: {
      type: String,
      require: [true, "Nomor Harus Diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
