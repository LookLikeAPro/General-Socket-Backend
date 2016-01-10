require("./config/setup");

switch (process.argv[2]) {
case "start":
	require("./app").run();
	break;
case "test":
	require("./tests").run();
	break;
default:
	console.log("WTF?");
}
