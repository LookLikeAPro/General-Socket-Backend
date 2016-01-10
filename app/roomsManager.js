import uuid from "uuid";
import Room from "./models/room";

function* entries(obj) {
	for (let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}

class roomsManager {
	constructor() {
		this.rooms = {};
		this.users = {};
		this.userRoomRelation = {};
	}
	getRooms() {
		var roomsArray = [];
		for (let [id, room] of entries(this.rooms)) {
			roomsArray.push(room);
		}
		return roomsArray;
	}
	getUsers() {
		var usersArray = [];
		for (let [id, user] of entries(this.users)) {
			usersArray.push(user);
		}
		return usersArray;
	}
	getRoomsCount() {
		return Object.keys(this.rooms).length;
	}
	getUsersCount() {
		return Object.keys(this.users).length;
	}
	getRoom(user) {
		return this.rooms[this.userRoomRelation[user.name]];
	}
	getUserByName(name) {
		return this.users[name];
	}
	getRoomByUUID(id) {
		return this.rooms[id];
	}
	_createRoom() {
		var room = new Room({uuid:uuid.v4()});
		this.rooms[room.uuid] = room;
		return room;
	}
	registerUser(user) {
		for (let [id, room] of entries(this.rooms)) {
			if (!room.isFull()) {
				room.join(user);
				this.userRoomRelation[user.name] = room.uuid;
				return room;
			}
		}
		//at this point, all rooms are full
		var room = this._createRoom();
		this.userRoomRelation[user.name] = room.uuid;
		return room;
	}
	deleteUser(user) {
		var room = this.getRoom(user);
		if (room && room.userCount === 1) {
			delete this.rooms[room.uuid];
		}
		else {
			room.leave(user);
		}
		delete this.users[user.name];
		delete this.userRoomRelation[user.name];
	}
}

export default new roomsManager();
