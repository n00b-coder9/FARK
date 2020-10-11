function isPasswordValid(password) {
  const len = password.length;
  return len >= 5;
}

function isRequired(value) {
  if (value === null || value === undefined) return false;
  return value.length !== 0;
}

function isEmailValid(email) {
  // Ref: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isNameOfUserValid(name) {
  return name.trim().length >= 2;
}

module.exports = {
  isPasswordValid,
  isEmailValid,
  isRequired,
  isNameOfUserValid,
};
