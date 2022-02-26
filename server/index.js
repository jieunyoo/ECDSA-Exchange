const express = require('express');
const app = express();
const cors = require('cors');
//const port = 3042;
const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const path = require('path')

const host = '0.0.0.0';
const port = process.env.PORT || 3000;


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const ec = new EC('secp256k1');
const key = ec.genKeyPair();
const publicKey = key.getPublic().encode('hex');

const privateKey1 = key.getPrivate().toString(16);
const publicX1 = key.getPublic().x.toString(16);
const publicY1 = key.getPublic().y.toString(16);

const key2 = ec.genKeyPair();
const publicKey2 = key2.getPublic().encode('hex');
const privateKey2 = key2.getPrivate().toString(16);
const publicX2 = key2.getPublic().x.toString(16);
const publicY2 = key2.getPublic().y.toString(16);

var value1 = 100;
var obj = {};
obj[publicX1] = value1;
let balances = {}

var value2 = 100;
var obj2 = {}
obj2[publicX2] = value2;
balances = {
  ...obj,
  ...obj2,
}

const ec2 = new EC('secp256k1');
const keySign = ec2.keyFromPrivate(privateKey1);

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

//*******************************************************
app.post('/sign', (req, res) => {
  const {sender, recipient, amount} = req.body;

  const message = amount;
  console.log(message)
  const msgHash = SHA256(message);
  const signature = keySign.sign(msgHash.toString());
  const PA1R = signature.r.toString(16);
  const PA1S = signature.s.toString(16);
  console.log({
    message,
    signature: {
      r: signature.r.toString(16),
      s: signature.s.toString(16)
    }
  });
  res.send({sign1R: PA1R, sign1S: PA1S });
  });


//*******************************************************
app.post('/send', (req, res) => {
  const {sender_verify, recipient_verify, amount_verify, publicKeyX_coordinate, s_coordinate, r_coordinate } = req.body;
  const message = amount_verify;
  //console.log(message)
  const msgHash = SHA256(message);
  const signature = keySign.sign(msgHash.toString());
  const rSig = signature.r.toString(16);
  const sSig = signature.s.toString(16);

  let isVerified = 0;
  var nonVerified_sender = sender_verify;
  var nonVerified_recipient = recipient_verify;
  var nonVerified_amount = amount_verify;

  if (publicKeyX_coordinate == publicX1 && s_coordinate == sSig && r_coordinate == rSig) { isVerified = 1;}
    else { isVerified = 0;}

  if (isVerified == 1) {
    balances[sender_verify] -= amount_verify;
    balances[recipient_verify] = (balances[recipient_verify] || 0) + +amount_verify;
    res.send({ balance: balances[sender_verify], balanceRec: balances[recipient_verify]});
  }
  else {
    console.log(isVerified)
    balances[nonVerified_sender] = balances[nonVerified_sender];
    balances[nonVerified_recipient] = (balances[nonVerified_recipient] || 0);
    res.send({ balance: balances[nonVerified_sender], balanceRec: balances[nonVerified_recipient]});
  }
});

//*******************************************************
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

//*******************************************************
console.log(publicX2)
app.get('/PA1X', (req, res) => {
  res.send({ address: publicX1, addressY: publicY1, address2X: publicX2, address2Y: publicY2, pk1: privateKey1, pk2: privateKey2});
});
