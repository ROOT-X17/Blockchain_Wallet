import Block from './block';
import Transaction from './transaction';

export default class BlockChain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], "");
    }
    getHeight() {
      return this.chain.length - 1;
    }
    getBlock(height) {
        return this.chain[height];
    }
    minePendingTransactions(miningRewardAddress) {
        const latestBlock = this.getBlock(this.getHeight());
        let block = new Block(Date.now(), this.pendingTransactions, latestBlock.hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain');
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error("hash not equal: " + JSON.stringify(currentBlock));
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                console.error("previous hash not right: " + JSON.stringify(currentBlock));
                return false;
            }
        }
        return true;
    }
}