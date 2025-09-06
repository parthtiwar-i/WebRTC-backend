import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", (ws) => {
  ws.on("open", (data: any) => {
    console.log("Websocket server is started", data);
  });

  ws.on("message", (data: any) => {
    const message = JSON.parse(data);
    if (message.type === "identify-as-sender") {
      senderSocket = ws;
    } else if (message.type === "identify-as-receiver") {
      receiverSocket = ws;
    } else if (message.type === "create-offer") {
      receiverSocket?.send(JSON.stringify({ type: "offer", sdp: message.sdp }));
    } else if (message.type === "create-answer") {
      senderSocket?.send(JSON.stringify({ type: "offer", sdp: message.sdp }));
    } else if (message.type === "ice-candidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({
            type: "ice-candidate",
            iceCandidate: message.iceCandidate,
          })
        );
      }
      if (ws === receiverSocket) {
        senderSocket?.send(
          JSON.stringify({
            type: "ice-candidate",
            iceCandidate: message.iceCandidate,
          })
        );
      }
    }
  });
  ws.on("error", (error: any) => {
    console.error(error);
  });

  ws.send("Connected to the websocket server ");
});
