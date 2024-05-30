const socket = io();

let username = null;

Swal.fire({
    title: "¡Bienvenido al chat! Por favor, ingrese su email:",
    input: "text",
    showCancelButton: true,
    inputValidator: (value) => {
        if (!value) {
            return "Su mail es requerido";
        }
    }
}).then((input) => {
    username = input.value;
    socket.emit('newUser', username);
});

const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const output = document.getElementById('output');
const actions = document.getElementById('actions');

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('chat:message', {
            user: username,
            message: message
        });
        messageInput.value = '';
    }
});

socket.on('messages', (data) => {
    actions.innerHTML = '';
    const chatRender = data.map((msg) => {
        return `<p><strong>${msg.user}</strong>: ${msg.message}</p>`;
    }).join(' ');

    output.innerHTML = chatRender;
});

socket.on('chat:storedMessages', (messages) => {
    const chatRender = messages.map((msg) => {
        return `<p><strong>${msg.user}</strong>: ${msg.message}</p>`;
    }).join(' ');

    output.innerHTML = chatRender;
});

socket.on('newUser', (username) => {
    Toastify({
        text: `${username} está logueado`,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () {}
    }).showToast();
});

messageInput.addEventListener('keypress', () => {
    socket.emit('chat:typing', username);
});

socket.on('chat:typing', (data) => {
    actions.innerHTML = `<p>${data} está escribiendo un mensaje...</p>`;
});
