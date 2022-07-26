/* eslint-disable no-undef */
const nacl = require('tweetnacl');
const nacl_util = require('tweetnacl-util');

import {lodash} from '@iy4u/common-client-lib';
const {$lget, $lset} = lodash;

module.exports = class EncryptDecrypt {
  constructor() {
  }

  // constructor(fromPubKey, fromPrivKey, toPubKey, toPrivKey){
  //     //this.dataToEncrypt = dataToEncrypt;
  //     this.fromPubKey = fromPubKey;
  //     this.fromPrivKey = fromPrivKey;
  //     this.toPubKey = toPubKey;
  // }

  /**
   * @returns {nacl.BoxKeyPair} a cryptographically secure asymmetric key pair
   */
  static getKeyPair() {
    return nacl.box.keyPair();
  }

  static handleKeyFormat(keyToFormat) {
    let formattedKey = keyToFormat;
    if (typeof keyToFormat == 'string') {
      formattedKey = nacl_util.decodeBase64(keyToFormat);
    }
    return formattedKey;
  }

  encryptAsymmetric(dataToEncrypt, toPubKey, fromPrivKey) {
    try {
      const formattedToPubKey = EncryptDecrypt.handleKeyFormat(toPubKey);
      const formattedFromPrivKey = EncryptDecrypt.handleKeyFormat(fromPrivKey);
      let nonce = nacl.randomBytes(nacl.box.nonceLength);
      let dataToEncryptStr = dataToEncrypt;
      //If the data we are trying to encrypt is already a string and we stringify it then the value will have double quotes
      if(typeof dataToEncrypt != 'string') {
        dataToEncryptStr = JSON.stringify(dataToEncrypt);
      }
      let messageUint8 = nacl_util.decodeUTF8(dataToEncryptStr);
      let encrypted = nacl.box(messageUint8, nonce, formattedToPubKey, formattedFromPrivKey);
      let fullMessage = new Uint8Array(nonce.length + encrypted.length);
      fullMessage.set(nonce);
      fullMessage.set(encrypted, nonce.length);
      let base64FullMessage = nacl_util.encodeBase64(fullMessage);
      return base64FullMessage;
    }
    catch (err) {
      console.log(err);
      throw new Error('Could not decrypt message');
    }
  }

  encryptSymmetric(dataToEncrypt, secKey){
    try {
      const formattedSecKey = EncryptDecrypt.handleKeyFormat(secKey);
      let nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      let dataToEncryptStr = dataToEncrypt;
      //If the data we are trying to encrypt is already a string and we stringify it then the value will have double quotes
      if(typeof dataToEncrypt != 'string') {
        dataToEncryptStr = JSON.stringify(dataToEncrypt);
      }
      let messageUint8 = nacl_util.decodeUTF8(dataToEncryptStr);
      const encryptedData = nacl.secretbox(messageUint8, nonce, formattedSecKey);
      const fullMessage = new Uint8Array(nonce.length + encryptedData.length);
      fullMessage.set(nonce);
      fullMessage.set(encryptedData, nonce.length);
      let base64FullMessage = nacl_util.encodeBase64(fullMessage);
      return base64FullMessage;
    }
    catch (err) {
      console.log(err);
      throw new Error('Could not encrypt message');
    }
  }

  decryptAsymmetric(dataToDecrypt, fromPubKey, toPrivKey) {
    try {
      const formattedFromPubKey = EncryptDecrypt.handleKeyFormat(fromPubKey);
      const formattedMyPrivKey = EncryptDecrypt.handleKeyFormat(toPrivKey);
      let messageWithNonce = nacl_util.decodeBase64(dataToDecrypt);
      let nonce = messageWithNonce.slice(0, nacl.box.nonceLength);
      let message = messageWithNonce.slice(nacl.box.nonceLength, messageWithNonce.length);
      let decrypted = nacl.box.open(message, nonce, formattedFromPubKey, formattedMyPrivKey);
      if (!decrypted) {
        throw new Error('Could not decrypt message');
      }
      var base64DecryptedMessage = nacl_util.encodeUTF8(decrypted);
      return JSON.parse(base64DecryptedMessage);
    } catch (err) {
      console.log(err);
      throw new Error('Could not decrypt message');
    }
  }

  decryptSymmetric(dataToDecrypt, secKey){
    try {
      const formattedSecKey = EncryptDecrypt.handleKeyFormat(secKey);
      const messageWithNonceAsUint8Array = nacl_util.decodeBase64(dataToDecrypt);
      const nonce = messageWithNonceAsUint8Array.slice(0, nacl.secretbox.nonceLength);
      const message = messageWithNonceAsUint8Array.slice(
        nacl.secretbox.nonceLength,
        messageWithNonceAsUint8Array.length
      );
      const decrypted = nacl.secretbox.open(message, nonce, formattedSecKey);
      if (!decrypted) {
        throw new Error('Could not decrypt message');
      }
      var base64DecryptedMessage = nacl_util.encodeUTF8(decrypted);
      return JSON.parse(base64DecryptedMessage);
    }
    catch (err) {
      console.log(err);
      throw new Error('Could not decrypt message');
    }
  }

  /**
   * Encrypts every field of the given JSON object
   */
  encryptJSONObject(){

  }

  /**
   * Decrypts every field of the JSON object
   */
  decryptJSONObject(){

  }

  /**
   * Encrypts the specified fields of the JSON object and returns the entire JSON object with the
   *  specified fields having been encrypted
   */
  encryptFields({encryptionType, data, fields, toPubKey, mySecKey}){
    //If there are no fields to encrypt just return the object
    if(!fields || fields.length === 0) return data;

    //iterate over the fields
    for(let i = 0; i < fields.length; i++) {
      let dataToEncrypt = $lget(data, fields[i]);
      let encryptedVal;
      if(encryptionType === 'Asymmetric'){
        encryptedVal = this.encryptAsymmetric(dataToEncrypt, toPubKey, mySecKey);
      }
      else if(encryptionType === 'Symmetric'){
        encryptedVal = this.encryptSymmetric(dataToEncrypt, mySecKey);
      }
      $lset(data, fields[i], encryptedVal);
    }
    return data;
  }

  /**
   * Decrypts the specified fields of the JSON object and returns the entire JSON object with the
   *  specified fields having been decrypted
   */
  decryptFields({decryptionType, data, fields, fromPubKey, mySecKey}){
    //If there are no fields to decrypt just return the object
    if(!fields || fields.length === 0) return data;

    //iterate over the fields
    for(let i = 0; i < fields.length; i++) {
      let dataToDecrypt = $lget(data, fields[i]);
      let decryptedVal;
      if(decryptionType === 'Asymmetric'){
        decryptedVal = this.decryptAsymmetric(dataToDecrypt, fromPubKey, mySecKey);
      }
      else if(decryptionType === 'Symmetric'){
        decryptedVal = this.decryptSymmetric(dataToDecrypt, mySecKey);
      }
      $lset(data, fields[i], decryptedVal);
    }
    return data;
  }
};
