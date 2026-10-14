const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]+$/;

// Returns { field: message } for every invalid field; an empty object means the form is valid.
export function validateCheckout(values) {
  const name = values.name.trim();
  const address = values.address.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const phoneDigits = phone.replace(/\D/g, '').length;
  const errors = {};

  if (name.length < 2) errors.name = 'Please enter your full name.';

  if (!values.studentClass) errors.studentClass = 'Please select the class you are studying in.';

  if (!address) errors.address = 'Please enter your home address.';
  else if (address.length < 10) errors.address = 'Please enter your complete address.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';

  if (!phone) errors.phone = 'Please enter your phone number.';
  else if (!PHONE_PATTERN.test(phone) || phoneDigits < 10 || phoneDigits > 15) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return errors;
}
