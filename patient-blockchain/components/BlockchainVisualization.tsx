'use client';

import { Block, Patient } from '@/types';
import { useState } from 'react';

interface BlockchainVisualizationProps {
  blockchain: Block[];
}

export function BlockchainVisualization({ blockchain }: BlockchainVisualizationProps) {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

  if (blockchain.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No blocks in the blockchain yet</p>
        <p className="text-sm mt-2">Add a patient record to create the first block</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {blockchain.map((block, index) => {
            const isGenesis = index === 0;
            const isExpanded = expandedBlock === index;

            return (
              <div key={block.index} className="flex items-center">
                <div
                  onClick={() => setExpandedBlock(isExpanded ? null : index)}
                  className={`
                    relative cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${isGenesis ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'}
                    ${isExpanded ? 'ring-4 ring-blue-300' : ''}
                    rounded-lg shadow-lg hover:shadow-xl p-6 min-w-[280px] text-white
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold opacity-90">
                      {isGenesis ? '🌟 GENESIS' : `BLOCK #${block.index}`}
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      Nonce: {block.nonce}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs opacity-75">Hash</p>
                      <p className="font-mono text-xs break-all bg-black/20 p-2 rounded">
                        {block.hash.substring(0, 16)}...
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-75">Previous Hash</p>
                      <p className="font-mono text-xs break-all bg-black/20 p-2 rounded">
                        {block.previousHash.substring(0, 16)}...
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-75">Timestamp</p>
                      <p className="text-xs">
                        {new Date(block.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {typeof block.data !== 'string' && (
                      <div className="pt-2 border-t border-white/20">
                        <p className="text-xs opacity-75 mb-1">Patient</p>
                        <p className="font-semibold">{block.data.name}</p>
                        <p className="text-xs opacity-90">Age: {block.data.age}, {block.data.gender}</p>
                      </div>
                    )}
                  </div>

                  {isExpanded && typeof block.data !== 'string' && (
                    <div className="mt-4 pt-4 border-t border-white/20 space-y-2 text-xs">
                      <div>
                        <span className="opacity-75">Blood Type:</span>
                        <span className="ml-2 font-medium">{block.data.bloodType || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="opacity-75">Diagnosis:</span>
                        <p className="mt-1 bg-black/20 p-2 rounded">{block.data.diagnosis || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="opacity-75">Medication:</span>
                        <p className="mt-1 bg-black/20 p-2 rounded">{block.data.medication || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="opacity-75">Doctor:</span>
                        <span className="ml-2 font-medium">{block.data.doctor || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {index < blockchain.length - 1 && (
                  <div className="flex items-center px-2">
                    <div className="text-3xl text-gray-400">→</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Click on any block to view detailed patient information.
          Each block is cryptographically linked to the previous one, ensuring data integrity.
        </p>
      </div>
    </div>
  );
}
