import uuid from "uuid";
import Room from "./models/room";
import db from "./tempDatabase";

function* entries(obj) {
	for (let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}

class roomsManager {
	constructor() {
		this.rooms = db.addCollection("rooms", {
			unique: ["id"]
		});
		this.users = db.addCollection("users", {
			unique: ["name"]
		});
		this.userRoomRel = db.addCollection("user_room");
	}
	getRooms() {
		return this.rooms.data;
	}
	getUsers() {
		return this.users.data;
	}
	getRoomsCount() {
		return this.rooms.length;
	}
	getUsersCount() {
		return this.users.length;
	}
	getRoomOfUser(user) {
		var roomId = this.userRoomRel.findOne({user: user.name}).room;
		return this.rooms.findOne({id: roomId});
	}
	getUserByName(name) {
		return this.users.findOne({name});
	}
	getRoomByID(id) {
		return this.rooms.findOne({id});
	}
	setRoomChannel(room, channel) {
		room.channel = channel;
		this.rooms.update(room);
	}
	registerUser(user) {
		this.users.insert(user);
		var possibleRoom = this.rooms.findOne({
			userCount: {$lt: 16}
		});
		if (possibleRoom) {
			this.userRoomRel.insert({user: user.name, room: possibleRoom.id});
			possibleRoom.userCount++;
			this.rooms.update(possibleRoom);
		}
		else {
			var newRoom = {
				id: uuid.v4(),
				userCount: 1
			};
			this.rooms.insert(newRoom);
			this.userRoomRel.insert({user: user.name, room: newRoom.id});
		}
		return user;
	}
	deleteUser(user) {
		this.users.removeWhere({name: user.name});
	}
}

export default new roomsManager();
