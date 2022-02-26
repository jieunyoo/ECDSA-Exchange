# ECDSA-Exchange

This app uses ECDSA cryptography to simulate a blockchain exchange. A randomly generated address with 100 fake ETH is generated. As proof of concept, you are shown the account's public and private keys. You can then sign a transaction to transfer money to another fake address. Behind the scenes, signing the transaction involves the ECDSA signing algorithm (RFC 6979).

This app then simulates the verification of the transaction. The above transaction is completed (ie., the money is sent) only if the signature is verified. Upon successful verification, balances in both accounts are updated.  

The app is live at [ECDSA-Exchange](https://client-bc.herokuapp.com/).
