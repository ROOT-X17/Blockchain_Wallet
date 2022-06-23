import BlockChain from "./src/final/blockchain";
import Transaction from "./src/final/transaction";
import { createWallet, validateWallet } from "./src/final/wallet";

const SIMPLE_BLOCKCHAIN = new BlockChain();
const myWallet = createWallet();
const KundaWallet = createWallet();

console.log(
  "is the myWallet from privateKey equals to publicKey?",
  validateWallet(myWallet.privateKey, myWallet.publicKey)
);

const tx1 = new Transaction(myWallet.publicKey, KundaWallet.publicKey, 60);

tx1.signTransaction(myWallet.keyPair);


SIMPLE_BLOCKCHAIN.addTransaction(tx1);

console.log("starting the miner of block 1...");

SIMPLE_BLOCKCHAIN.minePendingTransactions(myWallet.publicKey);

const tx2 = new Transaction(myWallet.publicKey, KundaWallet.publicKey, 80);
tx2.signTransaction(myWallet.keyPair);
SIMPLE_BLOCKCHAIN.addTransaction(tx2);
console.log("starting the miner of block 2...");
SIMPLE_BLOCKCHAIN.minePendingTransactions(myWallet.publicKey);

const tx3 = new Transaction(myWallet.publicKey, KundaWallet.publicKey, 100);
tx3.signTransaction(myWallet.keyPair);
SIMPLE_BLOCKCHAIN.addTransaction(tx3);
console.log("starting the miner of block 3...");
SIMPLE_BLOCKCHAIN.minePendingTransactions(myWallet.publicKey);

console.log(
  "Kundal's account balance is: ",
  SIMPLE_BLOCKCHAIN.getBalanceOfAddress(KundaWallet.publicKey)
);

console.log("is the chain valid? " + SIMPLE_BLOCKCHAIN.isChainValid());

SIMPLE_BLOCKCHAIN.chain[1].transactions[0].amount = 200;

console.log("is the chain still valid? " + SIMPLE_BLOCKCHAIN.isChainValid());

console.log(JSON.stringify(SIMPLE_BLOCKCHAIN, null, 4));
