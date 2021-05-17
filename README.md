# locals-faucetserver

A vapory faucet with a React frontend and a REST API. Works on any network you configure (and fund the faucet account ofcourse).

# prerequisites

- A running local GVAP node with RPC-JSON enabled.

# installing


```
cd locals-faucetserver
npm install
cd static
yarn build
cd ..
```

## Configuring the faucet API

Create a lightwallet ```wallet.json```

```
node mkwallet.js test > wallet.json
```

You can change `test` to whatever the password is that you want to encrypt your wallet with.

Create a config file ```config.json```

```
{
	"vaporscanroot": "http://vaporscan.com/address/",
	"payoutfrequencyinsec": 60,
	"payoutamountinvapor": 0.1,
	"queuesize": 5,
	"walletpwd": "test",
	"httpport": 3000,
	"web3": {
		"host": "http://<YOUR VAP NODE>:8575"
	}
}
```

Start your faucet:

```
node index.js
```


## Configuring the faucet frontend

edit the file `static/src/config.js` and specify the base URL for your API



# Demo

You can access our faucet at:
https://faucet.vapory.org/

# API

## Endpoint
```GET https://faucet.vapory.org/donate/{vapory address}```

## Request parameters
```vapory address``` your vapory address

## Response format
```
{
"paydate": 1461335186,
"address": "0x687422eea2cb73b5d3e242ba5456b782919afc85",
"amount": 1000000000000000000,
"txhash": "0x..."
}
```

* ```paydate``` the unix timestamp when the transaction will be executed. Depends on the current length of the queue
* ```address``` the address where the payment will be done
* ```amount``` the amount in Wei that will be transferred
* ```txhash``` transaction hash : if the queue is empty, you will immediately receive the transaction hash - if the queue is not empty - your request will be queued until paydate and the txhash field will be empty.

## HTTP Return / error codes

* ```200``` : Request OK
* ```400``` : The address is invalid
* ```403``` : The queue is full / you are greylisted / blacklisted.
* ```500``` : Internal faucet error











