
// Đối tượng Validator
export function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }

      element = element.parentElement;
    }
  };

  var selectorRules = {};

  // thực thi validate
  function validate(inputElement, rule) {
    // var errorElement = getParent(inputElement, '.form-group');
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector); // parentElement => get ra div cha của phần tử hiện tại
    var errorMessage;

    // lấy ra rules của selector
    var rules = selectorRules[rule.selector];
    // lặp qua từng rule và kiểm tra
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }

      // Nếu có lỗi thì dừng việc kiểm tra
      if (errorMessage) break;
    }

      if (errorMessage) {
        errorElement.innerText = errorMessage;
        getParent(inputElement, options.formGroupSelector).classList.add('invalid');
      } else {
        errorElement.innerText = '';
        getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
      }

      return !errorMessage;
  }

  // lấy element của form cầ validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    // khi click vào btn Submit form
    formElement.onsubmit = (e) => {
      e.preventDefault();

      var isFormValid = true;

      // thực hiện lặp qua từng rule
      options.rules.forEach((rule) => {
        var inputElement = formElement.querySelector(rule.selector);

        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // submit với javascript
        if (typeof options.onSubmit === 'function') {

          var enableInputs = formElement.querySelectorAll('[name]:not([disable])');

          var formValues = Array.from(enableInputs).reduce((values, input) => {
            switch(input.type) {
              case 'radio':
                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                break;
              case 'checkbox':  
                if (!input.matches(':checked')) {
                  // values[input.name] = '';
                  return values;
                }
                  
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }

                values[input.name].push(input.value);
                break;
              case 'file':
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          }, {});

          options.onSubmit(formValues);
        } 
        // submit với hành vi mặc định
        else {
          formElement.submit();
        }
      } 
    }
    // xử lý lặp qua mỗi rule(lắng nghe sự kiện)
    options.rules.forEach((rule) => {

      // lưu lại rules cho mỗi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
     
      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach((inputElement) => {
        // xử lý trường hợp blur khỏi input
        inputElement.onblur = () => {
          validate(inputElement, rule);
        }

        // xử lý trường hợp change trên input
        inputElement.onchange = () => {
          validate(inputElement, rule);
        }

        // xử lý trường hợp mỗi khi người dùng nhập (tối ưu UX)
        inputElement.oninput = () => {
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector); // parentElement => get ra div cha của phần tử hiện tại
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
      });
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
      return value ? undefined : "Vui lòng nhập trường này!" 
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
