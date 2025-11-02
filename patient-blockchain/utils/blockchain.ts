import { Block, Patient } from '@/types';

export function calculateHash(
  index: number,
  timestamp: string,
  data: Patient | string,
  previousHash: string,
  nonce: number
): string {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  const blockString = `${index}${timestamp}${dataString}${previousHash}${nonce}`;

  return sha256(blockString);
}

function sha256(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const hashHex = Math.abs(hash).toString(16).padStart(16, '0');
  return hashHex.repeat(4).substring(0, 64);
}

export function createGenesisBlock(): Block {
  const timestamp = new Date().toISOString();
  const genesisData = 'Genesis Block - Patient Blockchain Initialized';
  const previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const nonce = 0;

  const hash = calculateHash(0, timestamp, genesisData, previousHash, nonce);

  return {
    index: 0,
    timestamp,
    data: genesisData,
    previousHash,
    hash,
    nonce,
  };
}

export function mineBlock(
  index: number,
  timestamp: string,
  data: Patient,
  previousHash: string,
  difficulty: number = 2
): Block {
  let nonce = 0;
  let hash = '';
  const prefix = '0'.repeat(difficulty);

  while (!hash.startsWith(prefix)) {
    nonce++;
    hash = calculateHash(index, timestamp, data, previousHash, nonce);
  }

  return {
    index,
    timestamp,
    data,
    previousHash,
    hash,
    nonce,
  };
}

export function addBlock(blockchain: Block[], patientData: Patient): Block {
  const previousBlock = blockchain[blockchain.length - 1];
  const newIndex = previousBlock.index + 1;
  const timestamp = new Date().toISOString();

  return mineBlock(newIndex, timestamp, patientData, previousBlock.hash, 2);
}
