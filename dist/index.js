"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on("connection", (ws) => {
    ws.on("open", (data) => {
        console.log("Websocket server is started", data);
    });
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        if (message.type === "identify-as-sender") {
            senderSocket = ws;
        }
        else if (message.type === "identify-as-receiver") {
            receiverSocket = ws;
        }
        else if (message.type === "create-offer") {
            receiverSocket?.send(JSON.stringify({ type: "offer", sdp: message.sdp }));
        }
        else if (message.type === "create-answer") {
            senderSocket?.send(JSON.stringify({ type: "offer", sdp: message.sdp }));
        }
        else if (message.type === "ice-candidate") {
            if (ws === senderSocket) {
                receiverSocket?.send(JSON.stringify({
                    type: "ice-candidate",
                    iceCandidate: message.iceCandidate,
                }));
            }
            if (ws === receiverSocket) {
                senderSocket?.send(JSON.stringify({
                    type: "ice-candidate",
                    iceCandidate: message.iceCandidate,
                }));
            }
        }
    });
    ws.on("error", (error) => {
        console.error(error);
    });
    ws.send("Connected to the websocket server ");
});
//# sourceMappingURL=index.js.map