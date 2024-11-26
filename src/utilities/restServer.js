const express = require("express");

function createServer() {
    const callbackSubpath = "/returnData";
    const app = express();
    var PORT = 9091;
    const callbackURL = `http://73.181.146.161:9091${callbackSubpath}`;

    app.use(express.json());
    app.listen(PORT, () => {
        console.log("Server Listening on PORT:", PORT);
    });
}

createServer();
