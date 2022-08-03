
// Đối tượng Validator
export function Validator(options) {

  var selectorRules = {};

  // thực thi validate
  function validate(inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(options.errorSelector); // parentElement => get ra div cha của phần tử hiện tại
    var errorMessage;

    // lấy ra rules của selector
    var rules = selectorRules[rule.selector];
    // lặp qua từng rule và kiểm tra
    for (var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      // Nếu có lỗi thì dừng việc kiểm tra
      if (errorMessage) break;
    }

      if (errorMessage) {
        errorElement.innerText = errorMessage;
        inputElement.parentElement.classList.add('invalid');
      } else {
        errorElement.innerText = '';
        inputElement.parentElement.classList.remove('invalid');
      }
  }

  // lấy element của form cầ validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    options.rules.forEach((rule) => {

      // lưu lại rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
     
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        // xử lý trường hợp blur khỏi input
        inputElement.onblur = () => {
          validate(inputElement, rule);
        }

        // xử lý trường hợp mỗi khi người dùng nhập (tối ưu UX)
        inputElement.oninput = () => {
          var errorElement = inputElement.parentElement.querySelector(options.errorSelector); // parentElement => get ra div cha của phần tử hiện tại
          errorElement.innerText = '';
          inputElement.parentElement.classList.remove('invalid');
        }
      }
    })
  }
}

// Định nghĩa rules
// Nguyên tắc của rules:
// 1. Khi có lỗi => trả về message lỗi
// 2. Khi hợp lệ => kh cần trả về (undefined)
export const isRequired = (selector) => {
  return {
    selector,
    test(value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này!" // trim() là function loại bỏ khoảng cách
    }
  }
}

export const isEmail = (selector) => {
  return {
    selector,
    test(value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      return regex.test(value) ? undefined : "Trường này phải là Email!" 
    }
  }
} 

export const isPassword = (selector, min) => {
  return {
    selector,
    test(value) {
      if (value.trim()) { // trim() là function loại bỏ khoảng cách
        return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự!`;
      } else {
        return "Vui lòng nhập trường này!"
      }
    }
  }
} 

export const isPasswordConfirm = (selector, getConfirmValue, min, message) => {
  return {
    selector,
    test(value) {
      if (value === getConfirmValue() && value.length >= min) {
        return undefined;
      } else if (value === getConfirmValue() && value.length < min) {
        return `Vui lòng nhập tối thiểu ${min} ký tự!`;
      } else {
        return "Mật khẩu nhập lại không trùng khớp! Vui lòng nhập lại.";
      }
    }
  }
} 
