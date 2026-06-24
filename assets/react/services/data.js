export const getRequestHeaders = (isFormData = false, needToken = true) => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  };

  if (isFormData) delete headers['Content-Type'];

  if (needToken && localStorage.getItem('token')) {
    headers['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('token')).token}`;
  }
  return headers;
};
