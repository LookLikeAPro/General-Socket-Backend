import socketio from "socket.io";
import express from "express";
import http from "http";
import roomsManager from "./roomsManager";
import auth from "../routes/auth";

import Victor from "victor";
import {entries} from "../helpers/iterators";
import uuid from "uuid";

class Room {
	constructor() {
		this.id = uuid.v4();
		this.entities = {};
		this.entityCount = 0;
	}
	getNearby(thisEntity, distance) {
		var thisEntity = this.entities[thisEntity.id];
		var distanceSq = distance*distance;
		var returnEntities = [];
		for (let [id, entity] of entries(this.entities)) {
			if (entity !== thisEntity) {
				if (thisEntity.position.distanceSq(entity.position) <= distanceSq) {
					returnEntities.push(entity);
				}
			}
		}
		return returnEntities;
	}
	addEntity(entity) {
		if (this.entities[entity.id]) {
			return false;
		}
		this.entities[entity.id] = entity;
		this.entityCount++;
		return true;
	}
	removeEntity(entity) {
		if (this.entities[entity.id]) {
			delete this.entities[entity.id];
			return true;
		}
		return false;
	}
}

class Entity {
	constructor(type) {
		this.id = uuid.v4();
		this.type = type;
		this.room = null;
		this.position = null;
		this.velocity = null;
	}
}

class User extends Entity {
	constructor({name}) {
		super(User);
		this.name = name;
	}
}

export function run() {
	var app = express();
	var server = http.createServer(app);

	app.use("/api/auth", auth);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		res.status(404);
		res.send({error: "Not found"});
		return;
	});
	// error handler
	// no stacktraces leaked to user unless in development environment
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: (app.get("env") === "development") ? err : {}
		});
	});

	var io = socketio.listen(server);

	io.sockets.on("connection", function(socket) {
		socket.on("authentication", function(userArgs) {
			var user = roomsManager.registerUser(userArgs);
			var room = roomsManager.getRoomOfUser(user);
			socket.emit("authenticated");
			socket.join(room.id);
			socket.emit("setRoom", room);
			io.sockets.in(room.id).emit("newUser", userArgs);
			socket.on("userRealtime", function(obj) {
				console.log(obj);
			});
		});
	});

	setTimeout(function() {
		console.log(roomsManager.rooms.data);
		console.log(roomsManager.users.data);
		console.log(roomsManager.userRoomRel.data);
	}, 1000);

	server.listen(require(__dirname + "/../config/config.json").port);
}
