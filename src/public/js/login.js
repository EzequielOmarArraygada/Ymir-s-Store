const form = document.querySelector('#login-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  fetch('/api/sessions/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) window.location.href = '/products';
      else {
        Swal.fire({
          title: 'No se ah podido iniciar sesión',
          icon: 'error',
          text: result.message,
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error al logear',
        icon: 'error',
        text: error,
      });
    });
});
