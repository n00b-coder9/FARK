function isPasswordValid(password) {
  const len = password.length;
  return len >= 5;
}

function isRequired(value) {
  const len = value.length;
  return len!==0;
}

function isRequired(value) {
  const len = value.length;
  if (len === 0) return false;
  return true;
}

function isEmailValid(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // ref:https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  return re.test(String(email).toLowerCase());
}

module.exports = {
  isPasswordValid,
  isEmailValid,
  isRequired,
};
