const WebSocket = require('ws');



// Define the port for the signaling server

const PORT = 8080; // Ensure this matches SIGNALING_SERVER_URL in your React app



const wss = new WebSocket.Server({ port: PORT });



const clients = new Map(); // Map to store client IDs and their WebSocket connections (id -> ws_instance)



wss.on('connection', ws => {

console.log('Client connected');



    let clientId = null;



    ws.on('message', message => {

        try {

            const parsedMessage = JSON.parse(message);

            console.log('Received:', parsedMessage);



            switch (parsedMessage.type) {

                case 'register':

                    // Register the client with their ID

                    clientId = parsedMessage.id; // Store the ID received from the client

                    clients.set(clientId, ws);

                    console.log(`Client ${clientId} registered.`);



                    // Notify all other clients that a new user joined

                    clients.forEach((clientWs, id) => {

                        if (id !== clientId && clientWs.readyState === WebSocket.OPEN) {

                            clientWs.send(JSON.stringify({ type: 'user-joined', id: clientId }));

                        }

                    });

                    break;

                case 'offer':

                case 'answer':

                case 'ice-candidate':

                    // Relay the message to the target client

                    const targetWs = clients.get(parsedMessage.targetId);

                    if (targetWs && targetWs.readyState === WebSocket.OPEN) {

                        // Add senderId to the message before relaying

                        targetWs.send(JSON.stringify({ ...parsedMessage, senderId: clientId })); // Use clientId as senderId

                        console.log(`Relayed ${parsedMessage.type} from ${clientId} to ${parsedMessage.targetId}`);

                    } else {

                        console.warn(`Target client ${parsedMessage.targetId} not found or not open.`);

                    }

                    break;

                default:

                    console.warn('Unknown message type:', parsedMessage.type);

            }

        } catch (error) {

            console.error('Error parsing message or handling WebSocket message:', error);

        }

    });



    ws.on('close', () => {

        console.log('Client disconnected');

        if (clientId) {

            clients.delete(clientId); // Remove the client from the map

            console.log(`Client ${clientId} unregistered.`);



            // Notify all remaining clients that this user left

            clients.forEach((clientWs, id) => {

                if (clientWs.readyState === WebSocket.OPEN) {

                    clientWs.send(JSON.stringify({ type: 'user-left', id: clientId }));

                }

            });

        }

    });



    ws.on('error', error => {

        console.error('WebSocket error on server:', error);

        // This error might be due to a client disconnecting abruptly or network issues.

        // The 'close' event will usually follow this.

    });

});



console.log(`Signaling server started on ws://localhost:${PORT}`);



// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
