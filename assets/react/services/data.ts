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

export const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
