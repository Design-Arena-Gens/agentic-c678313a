export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  diagnosis: string;
  medication: string;
  doctor: string;
  timestamp: string;
}

export interface Block {
  index: number;
  timestamp: string;
  data: Patient | string;
  previousHash: string;
  hash: string;
  nonce: number;
}
