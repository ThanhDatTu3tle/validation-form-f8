import { Validator, isRequired, isEmail, isPassword, isPasswordConfirm } from './app.js';

// Sử dụng thư viện :>
Validator({
  form: '#form-1',
  formGroupSelector: '.form-group',
  errorSelector: '.form-message',
  rules: [
    isRequired('#fullname'),
    isRequired('#email'),
    isEmail('#email'),
    isRequired('input[name="gender"]'),
    isRequired('#province'),
    isRequired('#password'),
    isPassword('#password', 6),
    isRequired('#password_confirmation'),
    isPasswordConfirm('#password_confirmation', () => {
      return document.querySelector('#form-1 #password').value;
    }, 6, 'Mật khẩu không chính xác!'),
  ],
  onSubmit: (data) => {
    // Call API
    console.log(data);
  },
});
