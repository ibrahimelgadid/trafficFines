const asyncHandler = require("express-async-handler");
const loginValidation = require("../validation/loginValidation");
const registerValidation = require("../validation/registerValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models").User;
const Reset_pass = require("../models").Reset_pass;
const Verify_user = require("../models").Verify_user;
const resetPassEmailValidation = require("../validation/resetPassEmailValidation");
const changePasswordValidation = require("../validation/changePasswordValidation");
const { sendEmail } = require("../utilis/email");
const { Op } = require("sequelize");

///////////////////////////
//! get users functionality
//////////////////////////
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  if (users.length === 0) {
    return res.json({
      usersErr: "لا يوجد أى أعضاء حتى الان.",
    });
  }
  res.json(users);
});

///////////////////////////
//! register functionality
//////////////////////////
exports.register = asyncHandler(async (req, res) => {
  const { username, email, address, phone, password } = req.body;
  // check validation
  const { isValid, errors } = registerValidation(req.body);
  if (!isValid) return res.status(400).json(errors);
  // if this email exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    errors.email = "هذا الايميل موجود بالفعل";
    return res.status(400).json(errors);
  }
  let newUser = {
    username: username,
    email: email,
    address: address,
    phone: phone,
    password: password,
  };
  const user = await User.create(newUser);
  res.json(user);
});

///////////////////////////
//! login functionality
//////////////////////////
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check validation
  const { isValid, errors } = loginValidation(req.body);
  if (!isValid) return res.status(400).json(errors);
  // if this email exists
  const userExists = await User.findOne({ where: { email } });
  if (!userExists) {
    errors.email = "هذا الايميل غير موجود";
    return res.status(400).json(errors);
  }

  // check password

  if (!(await bcrypt.compare(password, userExists.password))) {
    errors.password = "رمز المرور غير صحيح";
    return res.status(400).json(errors);
  }

  let userPayload = {
    id: userExists.id,
    username: userExists.username,
    email: userExists.email,
    address: userExists.address,
    phone: userExists.phone,
  };
  const token = jwt.sign(userPayload, process.env.JWT_SECRET);
  res.json({ token });
});

/////////////////////////////////////////////
//! Email verification
/////////////////////////////////////////////
exports.emailVerification = asyncHandler(async (req, res) => {
  // validate inputs
  let { errors, isValid } = resetPassEmailValidation(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // check if email existence
  let isExistsEmail = await User.findOne({ where: { email: req.body.email } });
  errors.email = "هذا الايميل غير موجود";
  if (!isExistsEmail) {
    return res.status(400).json(errors);
  }
  const token = `${Math.random(Date.now() * 580585)}`;
  const info = sendEmail({
    subject: "Email verification",
    token,
    title: "Email verification",
    email: req.body.email,
  });

  // add to database
  if (info) {
    const newToken = await Verify_user.create({
      token,
      userId: isExistsEmail.id,
    });

    res.status(200).json(newToken);
  } else {
    res.status(400).json("There's an error");
  }
});

/////////////////////////////////////////////
//! change user status
/////////////////////////////////////////////
exports.changeUserStatus = asyncHandler(async (req, res) => {
  const existsEmail = await User.findOne({
    where: { email: req.query.email },
  });
  let errors = {};
  if (existsEmail) {
    const token = await Verify_user.findOne({
      where: { userId: existsEmail.id },
    });

    if (token) {
      if (token.time < Date.now()) {
        await Verify_user.destroy({ where: { userId: existsEmail.id } });
        errors.token = "expired token, please send another email reset";
        return res.status(400).json(errors);
      }

      if (token.token == req.query.token) {
        const updatedUser = await User.update(
          { verified: true },
          { where: { email: req.query.email } }
        );
        if (updatedUser) {
          await Verify_user.destroy({ where: { userId: existsEmail.id } });
          res.status(200).json("done");
        }
      }
    } else {
      errors.password = "there is no token";
      res.status(400).json(errors);
    }
  }
});

/////////////////////////////////////
//! SEND EMAIL WITH RESET PASS TOKEN
/////////////////////////////////////
exports.resetPassEmail = asyncHandler(async (req, res, next) => {
  // validate inputs
  let { errors, isValid } = resetPassEmailValidation(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check if email existence
  let isExistsEmail = await User.findOne({ where: { email: req.body.email } });
  errors.email = "هذا الايميل غير موجود";
  if (!isExistsEmail) {
    return res.status(400).json(errors);
  }

  //send email
  const token = `${Math.random(Date.now() * 580585)}`;
  const info = sendEmail({
    subject: "Reset Password",
    token,
    title: "Reset Password",
    email: req.body.email,
  });

  // add to database
  if (info) {
    const newToken = await Reset_pass.create({
      token,
      userId: isExistsEmail.id,
    });

    res.status(200).json(newToken);
  } else {
    res.status(400).json("There's an error");
  }
});

/////////////////////////////////////////////
//! CHANGE PASSWORD AFTER EMAIL RESET SENDED
/////////////////////////////////////////////
exports.changePassword = asyncHandler(async (req, res) => {
  let { errors, isValid } = changePasswordValidation(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const existsEmail = await User.findOne({
    where: { email: req.query.email },
  });
  if (existsEmail) {
    const token = await Reset_pass.findOne({
      where: { userId: existsEmail.id },
    });

    if (token) {
      if (token.time < Date.now()) {
        await Reset_pass.destroy({ where: { userId: existsEmail.id } });
        errors.token = "expired token, please send another email reset";
        return res.status(400).json(errors);
      }

      if (token.token == req.query.token) {
        const updatedUser = await User.update(
          { password: req.body.password },
          { where: { email: req.query.email } }
        );
        if (updatedUser) {
          await Reset_pass.destroy({ where: { userId: existsEmail.id } });
          res.status(200).json("done");
        }
      }
    } else {
      errors.password = "there is no token";
      res.status(400).json(errors);
    }
  }
});
