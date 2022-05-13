const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
require('dotenv').config()

const API_USER  = process.env.API_USER
const API_KEY =  process.env.API_KEY

//DEV
//let BASE_URL = 'https://dev.stratum.global/api/';

//PRODUCTION
 let BASE_URL = 'https://stratum.global/api/';

let getWalletsPayload = {
    "wallet_id": 40
}

let payload = {
    "currency" : "BTC"

}

//let payload_time_stamp = {
//    "operation_ts_from": 1554898520,
//    "operation_upd_ts_to": 1554898638
//    }

//let assignWalletZCR = {
//  "wallet_id": 54,
 // "wallet_address_label": "zcr cointrade test"
//}

//let getZcoreAddress = {
//  "currency" : "ZCR",
//  "wallet_address": "ZK6btXkzRfyccXv3xDTKk23ss2B5L55rb6"
//}


//REQUEST OPERATIONS FEES

//listOperations(payload_time_stamp).then(res => {
//    console.log("OK");
 //   console.log(res)
//}).catch(err => {
 //   console.log("ERRR");
 //   console.log(err)
//})


//REQUEST WITH PAYLOAD EXEMPLE

 getWallets(getWalletsPayload).then(res => {
     console.log("OK");
     console.log(res)
 }).catch(err => {
     console.log("ERRR");
     console.log(err)
 })



async function echo(payload) {
    const url = 'test/echo';
    return await baseRequest(url, payload)
}


async function listWallets(payload) {
    const url = 'wallets/list';
    return await baseRequest(url, payload)
}
async function getWallets(payload) {
    const url = 'wallets/get';
    return await baseRequest(url, payload)
}


/*Operations*/
async function listOperations(payload) {
    const url = '/operations/list';
    return await baseRequest(url, payload)
}

async function listOperationsFees(payload) {
    const url = '/operations/fees';
    return await baseRequest(url, payload)
}

/*Wallets*/
async function walletsCreate(payload) {
    const url = '/wallets/create';
    return await baseRequest(url, payload)
}

async function walletsAddressesList(payload) {
    const url = '/walletAddresses/list';
    return await baseRequest(url, payload)
}

async function walletsAddresses(payload) {
    const url = '/walletAddresses/get';
    return await baseRequest(url, payload)
}

async function walletsAddressesAssign(payload) {
    const url = '/walletAddresses/assign';
    return await baseRequest(url, payload)
}

async function walletsList(payload) {
    const url = '/wallets/list';
    return await baseRequest(url, payload)
}


async function baseRequest(url, jsonPayload = null) {


    const userKeys = {
        "api_user": API_USER,
        "api_key": API_KEY
    }


    let time = Math.floor(+new Date() / 1000);
    let str = `api_ts=${time}&api_user=${userKeys.api_user}&payload=${JSON.stringify(jsonPayload)}`;
    const hmac = crypto.createHmac('sha256', userKeys.api_key);
    hmac.update(str);
    let api_sig = hmac.digest('hex');

    try {
        const body = {
            'api_sig': api_sig,
            'api_ts': time,
            'api_user': userKeys.api_user,
            'payload': JSON.stringify(jsonPayload),
        }

        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        const resp = await axios.post(BASE_URL + url, qs.stringify(body), config)
        const data = resp.data;

        if (data && data.status === "ok") {
            return data.data;

        } else if (data && data.status === 'failed') {

            const errorsArray = Object.entries(data.data)
            let arrayOfErrors = [];
            errorsArray.forEach(([key, value]) => {
                console.log("Error -> " + key +" == " + value);
            })


        } else {

            throw new Error("server error")
        }


    } catch (e) {

        throw e
    }
}
