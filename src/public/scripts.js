const socket = io()

document.getElementById('chat_form').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value;
    const username = document.getElementById('username').value;

    socket.emit('chatMessage', { username, message }); 
    messageInput.value = ''; 
});

socket.on('message', (data)=>{
    const chatMessages = document.getElementById('chat_messages')
    const messageElement = document.createElement('div')
    messageElement.innerHTML = `<strong>${data.username}</strong> ${data.message}`
    chatMessages.appendChild(messageElement)
})

document.getElementById('username_form').addEventListener('submit', (e)=>{
    e.preventDefault()
    const usernameInput = document.getElementById('username')
    const username = usernameInput.value

    socket.emit('newUser', username)

    Swal.fire({
        icon: 'success',
        title: 'Bienvenido al Chat',
        text: `Estas conectado como ${username}`
    })

    document.getElementById('username_form').style.display = 'none'
    document.getElementById('chat_form').style.display = 'block'
})
