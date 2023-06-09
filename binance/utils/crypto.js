
import { sha256 } from '@noble/hashes/sha256';
import { pbkdf2Sync }from 'ethereum-cryptography/pbkdf2';
import { utf8ToBytes, bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils';
import { encrypt, decrypt } from 'ethereum-cryptography/aes';
import { privateToPublic, privateToAddress } from '@ethereumjs/util';

export const hashStr = (str) => {
  return bytesToHex(sha256(utf8ToBytes(str)));
};

const iv = randomBytes(16);

export const enryptKey = async (key, secret) => {
  const encryptKey = await pbkdf2Sync(utf8ToBytes(secret), utf8ToBytes('salt'), 131072, 16, 'sha256');
  const res = await encrypt(hexToBytes(key), encryptKey, iv);
  return bytesToHex(res);
};

export const decryptKey = async (key, secret) => {
  const dencryptKey = await pbkdf2Sync(utf8ToBytes(secret), utf8ToBytes('salt'), 131072, 16, 'sha256');
  const res = await decrypt(hexToBytes(key), dencryptKey, iv);
  return bytesToHex(res);
};

export const generate = () => {
  const privateKey = randomBytes(32);
  const publicKey = privateToPublic(Buffer.from(privateKey)).toString('hex');
  return { privateKey: bytesToHex(privateKey), publicKey };
};

export const randomStr = () => {
  const random = randomBytes(32);
  return bytesToHex(random);
};

export const COINS = ['ETH', 'RBTC', 'BNB', 'SGB'];
