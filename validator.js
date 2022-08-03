import { Validator, isRequired, isEmail, isPassword, isPasswordConfirm } from './app.js';

// Sử dụng thư viện :>
Validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequired('#fullname'),
    isEmail('#email'),
    isPassword('#password', 6),
    isPasswordConfirm('#password_confirmation')
  ]
});
