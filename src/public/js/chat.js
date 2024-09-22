const socket = io();

document.querySelector('#chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const messageInput = document.querySelector('#message');
  const message = messageInput.value;
  messageInput.value = '';
  socket.emit('chatMessage', message);
});

socket.on('message', (data) => {
  const chatMessages = document.querySelector('#chat-messages');
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${data.userEmail}:</strong> ${data.message}`;
  chatMessages.appendChild(messageElement);
});

socket.on('error', (error) => {
  Swal.fire({
    title: 'Error al enviar el mensaje',
    text: `Error: ${error}`,
    icon: 'error',
  });
});

const useremailForm = document.querySelector('#useremail-form');
useremailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userEmail = document.querySelector('#useremail').value;
  socket.emit('newUser', userEmail);

  Swal.fire({
    title: 'Bienvenido',
    text: `Logeado como ${userEmail}`,
    icon: 'success',
  });

  useremailForm.style.display = 'none';
  document.querySelector('#chat-form').style.display = 'block';
});
