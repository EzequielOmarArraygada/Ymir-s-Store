const form = document.querySelector('#restore-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  fetch('/api/sessions/restore', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: 'Contraseña restaurada exitosamente',
          icon: 'success',
          showDenyButton: false,
          confirmButtonText: 'Login',
        }).then((result) => {
          if (result.isConfirmed) window.location.href = '/login';
        });
      } else {
        Swal.fire({
          title: 'Error al registrarse',
          icon: 'error',
          text: result.message,
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error al registrarse',
        icon: 'error',
        text: error,
      });
    });
});
