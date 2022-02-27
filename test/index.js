let server = require("../server/index.js");
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const API = 'http://localhost:3000'

const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');

const cors = require('cors');

describe ("GET /", () => {
  it("response should return public addresses and keys", (done) => {
    const ec = new EC('secp256k1');
    const key = ec.genKeyPair();
    const privateKey1 = key.getPrivate().toString(16);
    const publicX1 = key.getPublic().x.toString(16);
    const publicY1 = key.getPublic().y.toString(16);
    const key2 = ec.genKeyPair();
    const publicKey2 = key2.getPublic().encode('hex');
    const privateKey2 = key2.getPrivate().toString(16);
    const publicX2 = key2.getPublic().x.toString(16);
    const publicY2 = key2.getPublic().y.toString(16);

    chai.request(API)
    .get("/PA1X")
    .end( (err, response) => {
      response.should.have.status(200);
      response.body.should.have.property('address');
      response.body.should.have.property('addressY');
      response.body.should.have.property('address2X');
      response.body.should.have.property('address2Y');
      response.body.should.have.property('pk1');
      response.body.should.have.property('pk2');
      done();
    })
  })
})

describe("POST /", () => {
  it("should return status 200 that it posted signatures", (done) => {
    const ec2 = new EC('secp256k1');
    const key = ec2.genKeyPair();
    const privateKey1 = key.getPrivate().toString(16);
    const keySign = ec2.keyFromPrivate(privateKey1);
    const message = 12;

    const msgHash = SHA256(message);
    const signature = keySign.sign(msgHash.toString());
    const PA1R = signature.r.toString(16);
    const PA1S = signature.s.toString(16);
    chai.request(API)
    .post("/sign")
    .send ( {
      sign1R: PA1R,
      sign1S: PA1S
    }).
    end( (err, res) => {
      res.should.have.status(200);
      done();
    })
  })
})
