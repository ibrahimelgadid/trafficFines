const express = require("express");
const {
  getAllUsers,
  register,
  login,
  resetPassEmail,
  changePassword,
  emailVerification,
  changeUserStatus,
} = require("../controller/usersController");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/resetPassEmail").post(resetPassEmail);
router.route("/changePassword").post(changePassword);
router.route("/verifyEmail").post(emailVerification);
router.route("/changeUserStatus").post(changeUserStatus);

module.exports = router;
