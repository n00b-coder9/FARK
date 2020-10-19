function isPasswordValid(password) {
  const len = password.length;
  return len >= 7;
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
const isUrlValid = (url) => {
  // Ref :https://www.geeksforgeeks.org/check-if-an-url-is-valid-or-not-using-regular-expression/
  const expression =
        /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);
  if (!regex.test(url)) {
    return { isValid: false, message: 'Please enter a valid Url' };
  }
  return { isValid: true };
};
module.exports = {
  isPasswordValid,
  isEmailValid,
  isRequired,
  isNameOfUserValid,
  isUrlValid,
};
