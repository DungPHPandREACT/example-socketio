const socket = io('http://localhost:3001', {
	transport: ['websocket'],
});

let currentRoom = '';

socket.on('connect', () => {
	console.log(`Kết nối thành công với ID: ${socket.id}`);
});

const writMessage = (message) => {
	const li = document.createElement('li');
	li.textContent = message;
	document.getElementById('messages').appendChild(li);
};

socket.on('message', (message) => {
	console.log(`Tin nhắn từ server: ${message}`);
	writMessage(message);
});

const leaveRoom = () => {
	if (currentRoom) {
		socket.emit('leaveRoom', currentRoom);
		const message = `Đang rời phòng ${currentRoom}`;
		writMessage(message);
		currentRoom = '';
	}
};

document.getElementById('leave').onclick = leaveRoom;

document.getElementById('join').onclick = () => {
	const room = document.getElementById('room').value;
	if (room) {
		if (currentRoom) {
			leaveRoom();
		}

		socket.emit('joinRoom', room);
		currentRoom = room;
		document.getElementById('messages').innerHTML = '';
		const message = `Bạn đã tham gia phòng ${room}`;
		writMessage(message);
	}
};

document.getElementById('send').onclick = () => {
	const value = document.getElementById('message').value;
	if (value && currentRoom) {
		socket.emit('message', currentRoom, value);
		const message = `Bạn: ${value}`;
		writMessage(message);
	} else if (!currentRoom) {
		alert('Bạn cần tham gia một phòng trước');
	}
};
