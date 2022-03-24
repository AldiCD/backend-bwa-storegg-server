var express = require("express");
var router = express.Router();
const { index, Actionstatus } = require("./controller");
const { isLoginAdmin } = require("../midleware/auth");

router.use(isLoginAdmin);
/* GET home page. */
router.get("/", index);
router.put("/status/:id", Actionstatus);

module.exports = router;
