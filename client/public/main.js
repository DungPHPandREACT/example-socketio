const socket = io('http://localhost:3001', {
	transport: ['websocket'],
});

let currentRoom = '';
let typingTimeout;

const roomInput = document.getElementById('room');
const btnJoinRoom = document.getElementById('joinRoom');
const messageInput = document.getElementById('message');
const btnSendMessage = document.getElementById('sendMessage');
const messageDiv = document.getElementById('messages');
const typingIndicator = document.getElementById('typingIndicator');

btnJoinRoom.onclick = () => {
	const room = roomInput.value.trim();
	if (room) {
		currentRoom = room;
		socket.emit('joinRoom', room);
		messageDiv.innerHTML = `<strong>Bạn đã tham gia phòng: ${room}</strong>`;
	}
};

btnSendMessage.onclick = () => {
	const message = messageInput.value.trim();
	if (message && currentRoom) {
		socket.emit('message', currentRoom, message);
		messageDiv.innerHTML = `<strong>Bạn: ${message}/strong>`;
		messageInput.value = '';
		socket.emit('stopTyping', currentRoom);
	}
};

messageInput.oninput = () => {
	if (currentRoom) {
		socket.emit('typing', currentRoom);

		clearTimeout(typingTimeout);

		timeoutTyping = setTimeout(() => {
			socket.emit('stopTyping', currentRoom);
		}, 2000);
	}
};

socket.on('message', (message) => {
	messageDiv.innerHTML += `<p>${message}</p>`;
});

socket.on('typing', (user) => {
	typingIndicator.innerHTML = `<strong>${user} đang gõ...</strong>`;
});

socket.on('stopTyping', () => {
	typingIndicator.innerHTML = '';
});
