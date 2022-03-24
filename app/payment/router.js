var express = require("express");
var router = express.Router();
const {
  index,
  viewCreate,
  ActionCreate,
  ViewEdit,
  ActionEdit,
  ActionDelete,
  ActionStatus,
} = require("./controller");
const { isLoginAdmin } = require("../midleware/auth");

router.use(isLoginAdmin);
/* GET home page. */
router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", ActionCreate);
router.get("/edit/:id", ViewEdit);
router.put("/edit/:id", ActionEdit);
router.delete("/delete/:id", ActionDelete);
router.put("/status/:id", ActionStatus);

module.exports = router;
