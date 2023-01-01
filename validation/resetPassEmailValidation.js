const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function resetEmailValidation(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "أدخل ايميل صالح";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "الايميل مطلوب";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
