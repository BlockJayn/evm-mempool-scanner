/**********************************************
 *   Imports
 *********************************************/

import * as dotenv from 'dotenv'
import { ethers } from "ethers";

dotenv.config();

/**********************************************
 *   Variables
 *********************************************/

const url: string | undefined = process.env.WSS_PROVIDER;

/**********************************************
 *   Scan Mempool Function
 *********************************************/

const scanMempool = (): void => {
  if (!url) {
    console.log(`Could not find WebSocket-Url.`);
    return;
  }

  /* Define Provider / create an ethers WebSocketProvider instance */
  const provider = new ethers.providers.WebSocketProvider(url);

  /* Event listener for pending transactions that will run each time a new transaction hash is sent from the node. */
  provider.on("pending", (tx: string) => {
    /* Getting the whole transaction using the transaction hash */
    provider.getTransaction(tx).then((transaction) => {
      console.log(transaction);
    });
  });

  /* Restart the WebSocket connection if the connection encounters an error. */
  provider._websocket.on("error", async () => {
    console.log(`Unable to connect. Retrying in 3s...`);
    setTimeout(scanMempool, 3000);
  });

  /* Restart the WebSocket connection if the connection dies. */
  provider._websocket.on("close", async (code: number) => {
    console.log(
      `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    provider._websocket.terminate();
    setTimeout(scanMempool, 3000);
  });
};

/* Calling the script */
scanMempool();
