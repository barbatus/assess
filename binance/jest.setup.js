import { Crypto } from '@peculiar/webcrypto';
import { TextEncoder, TextDecoder } from 'text-encoding-utf-8';

jest.mock('@noble/hashes/crypto', () => {
  return {
    crypto: {
      web: new Crypto(),
    }
  };
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.crypto = crypto;
