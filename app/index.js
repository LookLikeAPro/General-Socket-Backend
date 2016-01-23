import socketio from "socket.io";
import express from "express";
import http from "http";
import auth from "../routes/auth";
import uuid from "uuid";
import Victor from "victor";
import {entries} from "../helpers/iterators";
import Room from "./models/room";

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
		this.position = new Victor(0, 0);
		this.velocity = new Victor(0, 0);
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

	var room = new Room();
	io.sockets.on("connection", function(socket) {
		socket.on("authentication", function(userArgs) {
			var user = new User(userArgs);
			room.addEntity(user);
			socket.emit("authenticated");
			socket.join(room.id);
			socket.emit("setRoom", room);
			io.sockets.in(room.id).emit("newUser", userArgs);
			socket.on("userRealtime", function(obj) {
				var position = Victor.fromObject(obj.position);
				var velocity = Victor.fromObject(obj.velocity);
				user.position = position;
				user.velocity = velocity;
			});
			var update = setInterval(function() {
				socket.emit("positions", room.getNearby(user, 1000));
			}, 1000);
		});
	});

	setTimeout(function() {
		console.log(room.entities);
	}, 1000);

	server.listen(require(__dirname + "/../config/config.json").port);
}
