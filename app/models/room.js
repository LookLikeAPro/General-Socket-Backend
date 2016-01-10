export default class Room {
	constructor({name, uuid}) {
		this.name = name;
		this.uuid = uuid;
		this.capacity = 16;
		this.userCount = 0;
		this.users = {};
	}
	isFull() {
		return (this.userCount >= this.capacity);
	}
	join(user) {
		if (this.userCount >= this.capacity) {
			return false;
		}
		else {
			this.userCount++;
			this.users[user.name] = user;
		}
	}
	isInRoom(user) {
		if (this.users[user.name]) {
			return true;
		}
		return false;
	}
	leave(user) {
		if (this.users[user.name]) {
			delete this.users[user.name];
			return true;
		}
		delete this.users[user.name];
		return false;
	}
}
