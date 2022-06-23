const SHA256 = require('crypto-js/sha256');
import Elliptic from 'elliptic';

const ec = new Elliptic.ec('secp256k1');

export default class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

     calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
    
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!')
        }
        const txHash = this.calculateHash();
        const sign = signingKey.sign(txHash, 'base64');
        this.signature = sign.toDER('hex');
        console.log("signature: " + this.signature)
    }

    isValid() {
        if (this.fromAddress === null) return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}