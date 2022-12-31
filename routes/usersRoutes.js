const express = require("express");
const {
  getAllUsers,
  register,
  login,
} = require("../controller/usersController");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
