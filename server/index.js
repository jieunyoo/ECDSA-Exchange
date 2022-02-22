const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;

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
console.log(publicX1)

var value1 = 100;
var obj = {};

obj[publicX1] = value1
const balances = obj;

//const balances = {
//  "1": 100,
  //"2": 50,
  //3: 75,
//}

console.log(balances)
app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender], balanceRec: balances[recipient] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
