function isPasswordValid(password) {
  const len = password.length;
  return len >= 7;
}

function isRequired(value) {
  const len = value.length;
  return len !== 0;
}

function isEmailValid(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // Ref: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  return re.test(String(email).toLowerCase());
}

const validateName = (name) => {
  if (typeof name !== 'string' || name.trim().length < 2) {
    return {
      isValid: false,
      message:
        'Please enter a valid name',
    };
  }
  return { isValid: true };
};

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 7) {
    return {
      isValid: false,
      message: 'Length of password should be atleast 7',
    };
  }
  return { isValid: true };
};

const validateEmail = (email) => {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (typeof email !== 'string' || !regex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email' };
  }
  return { isValid: true };
};

module.exports = {
  isPasswordValid,
  isEmailValid,
  isRequired,
  validateName,
  validatePassword,
  validateEmail,
};
