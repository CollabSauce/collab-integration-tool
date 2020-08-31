export const handleNetworkError = (error) => {
  const response = error.response;
  let errors = [];

  if (response && response.data) {
    for (const key in response.data) {
      const errorType = response.data[key];
      for (const err of errorType) {
        errors.push(err);
      }
    }
  } else {
    errors.push('Something went wrong. Please try again.');
  }

  return errors.join(' ');
};
