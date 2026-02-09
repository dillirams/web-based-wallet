import express from 'express'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import cors from 'cors'
const app= express();

app.use(express.json());
app.use(cors())


let seed=""

app.post('/seed', async (req,res)=>{
    const mnemonic= generateMnemonic();

     seed= mnemonicToSeedSync(mnemonic).toString('hex')

    res.status(200).json({
        message:"remember this phrase to recover your wallet",
        mnemonic:mnemonic,
    })
})

console.log(seed);
let count=0;
app.post('/createwallet', async(req,res)=>{
   try{

     const path=`m/44'/501'/${count}'/0'`
    const derivedSeed=derivePath(path, seed.toString()).key;
    const secret=nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const privateKey=Keypair.fromSecretKey(secret).secretKey.toBase64();
    const publicKey=Keypair.fromSecretKey(secret).publicKey.toBase58();
    console.log(count);
    count++;
    res.status(200).json({
        message:"wallet created successfully",
        publicKey:publicKey
    
    })
   }catch(e){
    res.status(401).json({
        message:'something went wrong'
    })
   }
   
})

app.listen(3000, ()=>{
    console.log("the app is listening to port 3000");
})

 //"publicKey": "DjFanWQyBWeioWgf1c2a2mjpACDV9RagdvDsACde9ef"
 // "2YNc9qkfVT4QV2ExFyxTws4jJRL4YptTKbwXrqAsXgUf"