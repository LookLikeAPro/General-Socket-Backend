import client from "socket.io-client";
import {run as runApp} from "../app";

var socketURL = "http://0.0.0.0:5000";

export function run() {
	runApp();
	var client1 = client.connect(socketURL);
	client1.on("connect", function(){
		client1.emit("authentication", {username: "John", password: "secret"});
		client1.on("authenticated", function() {
			console.log("I AM NOW LOL");
		});
	});
	var client2 = client.connect(socketURL);
	client2.on("connect", function(){
		client2.emit("authentication", {username: "John", password: "secret"});
		client2.on("authenticated", function() {
			console.log("I AM NOW LOL");
		});
	});
}
