import Web3 from 'web3';

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    'https://kovan.infura.io/v3/1cdda339250c4a8d87d51e2609567e6e',
  )
);

export default web3;

