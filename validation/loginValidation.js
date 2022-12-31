const validator = require("validator");
const isEmpty = require("./isEmpty");

const loginValidation = (data) => {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // email validation
  if (!validator.isEmail(data.email)) {
    errors.email = "أدخل ايميل صحيح";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "الايميل مطلوب";
  }

  // password validation
  if (validator.isEmpty(data.password)) {
    errors.password = "رمز المرور مطلوب";
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

module.exports = loginValidation;
