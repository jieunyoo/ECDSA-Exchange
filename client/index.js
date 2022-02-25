import "./index.scss";
const EC = require('elliptic').ec;

const server = "http://localhost:3042";

var wallet1 = document.getElementById("exchange-address");
var wallet2 = document.getElementById("exchange-address2");
var wallet3 = document.getElementById("exchange-address3");

var walletBalance2 = document.getElementById("balance2");
var walletBalance3 = document.getElementById("balance3");

wallet1.addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });

});

wallet2.addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    walletBalance2.innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    balance2.innerHTML = balance;
  });
});

wallet3.addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    walletBalance3.innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    walletBalance3.innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  const body = JSON.stringify({
    sender, amount, recipient
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });
  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance, balanceRec, sign1R, sign1S  }) => {
    document.getElementById("balance").innerHTML = balance;
    document.getElementById("sign1R").innerHTML = sign1R;
    document.getElementById("sign1S").innerHTML = sign1S;
    console.log(recipient)
    console.log(wallet2.value)
    if (recipient == wallet2.value) {
	     walletBalance2.innerHTML = balanceRec; }
    else {
	     walletBalance3.innerHTML = balanceRec; }
     })
})

//this will print out public adddresses and private keys
const request = new Request(`${server}/PA1X/`, { method: 'GET', mode: 'cors' });
fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
  return response.json();
}).then(({ address, addressY, address2X, address2Y, pk1, pk2, address1R }) => {
  document.getElementById("publicAddress1X").innerHTML = address;
  document.getElementById("publicAddress1Y").innerHTML = addressY;
  document.getElementById("publicAddress2X").innerHTML = address2X;
  document.getElementById("publicAddress2Y").innerHTML = address2Y;
  document.getElementById("privateKey1").innerHTML = pk1;
 document.getElementById("privateKey2").innerHTML = pk2;
})
