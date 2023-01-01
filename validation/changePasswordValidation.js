const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function changePassword(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.password, { min: 8 })) {
    errors.password = "رمز المرور يجب ألا يقل عن 8 حروف";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "رمز المرور يجب الا تكون فارغ";
  }
  //! don't  forget
  // if (!validator.isAlphanumeric(data.password, { min: 8 })) {
  //   errors.password = "رمز المرور يجب يتكون من احرف وارقام";
  // }

  if (!validator.equals(data.password2, data.password)) {
    errors.password2 = "رمز التأكيد غير متساوى مع رمز المرور";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
