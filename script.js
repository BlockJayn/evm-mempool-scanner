/**********************************************
 *   Imports
 *********************************************/

require("dotenv").config();
let ethers = require("ethers");

/**********************************************
 *   Variables
 *********************************************/

let url = process.env.WSS_PROVIDER;

/**********************************************
 *   Scan Mempool Function
 *********************************************/

let scanMempool = function() {
  /* Define Provider / create an ethers WebSocketProvider instance */
  let provider = new ethers.providers.WebSocketProvider(url);

  /* Event listener for pending transactions that will run each time a new transaction hash is sent from the node. */
  provider.on("pending", (tx) => {
    /* Getting the whole transaction using the transaction hash */
    provider.getTransaction(tx).then(function(transaction) {
      console.log(transaction);
    });
  });

  /* Restart the WebSocket connection if the connection encounters an error. */
  provider._websocket.on("error", async () => {
    console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
    setTimeout(scanMempool, 3000);
  });

  /* Restart the WebSocket connection if the connection dies. */
  provider._websocket.on("close", async (code) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    provider._websocket.terminate();
    setTimeout(scanMempool, 3000);
  });
};

/* Calling the script */
scanMempool();
