'use client';

import { useState, useEffect } from 'react';
import { PatientForm } from '@/components/PatientForm';
import { BlockchainVisualization } from '@/components/BlockchainVisualization';
import { Block, Patient } from '@/types';
import { createGenesisBlock, addBlock, calculateHash } from '@/utils/blockchain';

export default function Home() {
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const storedBlockchain = localStorage.getItem('blockchain');
    const storedPatients = localStorage.getItem('patients');

    if (storedBlockchain) {
      setBlockchain(JSON.parse(storedBlockchain));
    } else {
      const genesis = createGenesisBlock();
      setBlockchain([genesis]);
      localStorage.setItem('blockchain', JSON.stringify([genesis]));
    }

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, []);

  const handleAddPatient = (patient: Omit<Patient, 'id' | 'timestamp'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    const newBlock = addBlock(blockchain, newPatient);
    const updatedBlockchain = [...blockchain, newBlock];
    const updatedPatients = [...patients, newPatient];

    setBlockchain(updatedBlockchain);
    setPatients(updatedPatients);

    localStorage.setItem('blockchain', JSON.stringify(updatedBlockchain));
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const verifyBlockchain = (): boolean => {
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];

      const recalculatedHash = calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash,
        currentBlock.nonce
      );

      if (currentBlock.hash !== recalculatedHash) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  };

  const isValid = blockchain.length > 0 ? verifyBlockchain() : true;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Patient Health Records Blockchain
          </h1>
          <p className="text-gray-600 text-lg">Secure, Immutable Healthcare Data Management</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium">
              Blockchain Status: {isValid ? 'Valid ✓' : 'Invalid ✗'}
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span> Add Patient Record
            </h2>
            <PatientForm onSubmit={handleAddPatient} />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">📊</span> Blockchain Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Blocks</span>
                <span className="text-2xl font-bold text-blue-600">{blockchain.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">Patient Records</span>
                <span className="text-2xl font-bold text-purple-600">{patients.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Chain Integrity</span>
                <span className="text-2xl font-bold text-green-600">{isValid ? '100%' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">⛓️</span> Blockchain Visualization
          </h2>
          <BlockchainVisualization blockchain={blockchain} />
        </div>
      </div>
    </main>
  );
}
