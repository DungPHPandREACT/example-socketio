const socket = io('http://localhost:3001', {
	transport: ['websocket'],
});

socket.on('message', (message) => {
	const li = document.createElement('li');
	li.textContent = message;
	document.getElementById('messages').appendChild(li);
});

document.getElementById('send').onclick = () => {
	const message = document.getElementById('message').value;

	if (message) {
		const li = document.createElement('li');
		li.textContent = `Bạn: ${message}`;
		document.getElementById('messages').appendChild(li);
		socket.emit('message', message);
		document.getElementById('message').value = '';
	}
};
