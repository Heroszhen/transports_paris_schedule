export const getRequestHeaders = (isFormData = false, needToken = true) => {
  const headers = new Headers();
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('Content-Type', 'application/json');

  if (isFormData) headers.delete('Content-Type');

  if (needToken) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${JSON.parse(token).token}`);
    }
  }
  return headers;
};
