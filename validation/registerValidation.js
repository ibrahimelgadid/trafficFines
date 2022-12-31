const validator = require("validator");
const isEmpty = require("./isEmpty");

const registerValidation = (data) => {
  let errors = {};
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // username validation
  if (!validator.isLength(data.username, { min: 2 })) {
    errors.username = "يجب الا يقل الاسم عن ثلاثة احرف";
  }
  if (validator.isEmpty(data.username)) {
    errors.username = "الأسم مطلوب";
  }

  // email validation
  if (!validator.isEmail(data.email)) {
    errors.email = "أدخل ايميل صحيح";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "الايميل مطلوب";
  }

  // phone validation
  if (validator.isEmpty(data.phone)) {
    errors.phone = "رقم الهاتف مطلوب";
  }
  if (!validator.isLength(data.phone, { min: 10 })) {
    errors.phone = "رقم الهاتف يجب الا يقل عن 10 ارقام";
  }

  // address validation
  if (validator.isEmpty(data.address)) {
    errors.address = " العنوان مطلوب";
  }

  // password validation

  if (validator.isEmpty(data.password)) {
    errors.password = "رمز المرور يجب الا تكون فارغ";
  }
  if (!validator.isLength(data.password, { min: 8 })) {
    errors.password = "رمز المرور يجب ألا يقل عن 8 حروف ولا يزيد عن 30 حرف";
  }
  //! don't  forget
  // if (!validator.isAlphanumeric(data.password, { min: 8 })) {
  //   errors.password = "رمز المرور يجب يتكون من احرف وارقام";
  // }

  if (!validator.equals(data.password2, data.password)) {
    errors.password2 = "رمز التأكيد غير متساوى مع رمز المرور";
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

module.exports = registerValidation;
