const SHA256 = require('crypto-js/sha256')   // import sha256 for use

class Block{
    constructor(index,timestamp, data, previousHash=''){ //parameters passed in when creating a block
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); //need to calculate the hash function of this block.
        //Hash takes all the properties of the block and run them through a hash function
        this.nonce =0 ; // A random number that has nothing to do with the block 

    }

    calculateHash(){
        //calculates hash of the current block by taking all the data and calculating the hash- using sha256.
        //sha256 needs library to be installed- crypto js
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+ this.nonce).toString();
    }
     //Proof of stake
    mineBlock(difficulty){ // difficulty limits how fast new blocks can be added to the list. 
        // we need to get a hash of a block to begin with 'difficulty' number of zeros
        //while loop must run until substring of the hash is zero
        //we compare substring of the hash to array of length difficulty zeros
        while(this.hash.substring(0,difficulty) !== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash); 
        //but hash won't change if we dont change block
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()]; //A chain is an array of blocks,initially containing genesis block
        this.difficulty = 8;
    }
    createGenesisBlock(){  //First block on a block chain and must be added manually 
        return new Block(0,"01/01/2017","Genesis block","0"); // no previos hash
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;  // new block's previous hash is the current latest block
        // In reality more checks must be done before adding a block to the blockchain.
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    //verify the integrity of blockchain - check if already added blocks have not been changed.
    isChainValid(){
        for(let i =1; i<this.chain.length;i++){ // start looping through list after genesis block
            const currentBlock = this.chain[i]; // for list to be checked
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()){  // recalculate hash for current block to see if the same information went into calculating it
                return false;
            }
            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

let mahlakoaneCoin = new Blockchain();

console.log("Mining block 1...");
mahlakoaneCoin.addBlock(new Block(1,"10/07/2021",{amount: 4}));

console.log("Mining block 2...");
mahlakoaneCoin.addBlock(new Block(2,"12/07/2021",{amount: 10}));

/*
console.log("Is blockchain valid?" + mahlakoaneCoin.isChainValid())
mahlakoaneCoin.chain[1].data = {amount: 100}; //manipulate block - data changed
mahlakoaneCoin.chain[1].calculateHash(); // but the manipulated node's relationship with others has been changed too
console.log("Is blockchain valid?" + mahlakoaneCoin.isChainValid());

// roll back changes in case of a error blockchain
// proof of work
// p2p network to communicate with other miners.

*/
