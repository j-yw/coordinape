import { JsonRpcProvider } from '@ethersproject/providers';

import { HARDHAT_GANACHE_PORT, INFURA_PROJECT_ID } from './config';

export function getProvider(chainId: number) {
  switch (chainId) {
    // TODO: return different providers for different production chains
    case 1: // mainnet
      return new JsonRpcProvider(
        `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
      );
    case 5: // Goerli
      return new JsonRpcProvider(
        `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`
      );
    case 1337:
    case 1338:
      return new JsonRpcProvider('http://localhost:' + HARDHAT_GANACHE_PORT);
    default:
      throw new Error(`chainId ${chainId} is unsupported`);
  }
}
