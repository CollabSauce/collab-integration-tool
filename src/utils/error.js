const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export const handleNetworkError = (error) => {
  const response = error.response;
  let errors = [];

  if (response && response.status >= 500) {
    errors.push(DEFAULT_ERROR_MESSAGE); // 500 error won't have readable error message
  } else if (response && response.data) {
    if (Array.isArray(response.data)) {
      for (const err of response.data) {
        errors.push(err);
      }
    } else {
      for (const key in response.data) {
        const errorType = response.data[key];
        for (const err of errorType) {
          errors.push(err);
        }
      }
    }
  } else {
    errors.push(DEFAULT_ERROR_MESSAGE);
  }

  return errors.join(' ');
};
