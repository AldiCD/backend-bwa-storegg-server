var express = require("express");
var router = express.Router();
const { viewsignIn, ActionSignin, ActionLogout } = require("./controller");

/* GET home page. */
router.get("/", viewsignIn);
router.post("/", ActionSignin);
router.get("/logout", ActionLogout);

module.exports = router;
