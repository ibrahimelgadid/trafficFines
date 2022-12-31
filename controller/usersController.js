const asyncHandler = require("express-async-handler");
const loginValidation = require("../validation/loginValidation");
const registerValidation = require("../validation/registerValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models").User;

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
  const token = jwt.sign(userPayload, config.jwtSecret);
  res.json({ token });
});
