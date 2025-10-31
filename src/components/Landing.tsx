import { Trophy, Users, DollarSign, Lock } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Quest } from '../types';

interface LandingProps {
  quests: Quest[];
  onStartQuest: (questId: string) => void;
}

export function Landing({ quests, onStartQuest }: LandingProps) {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Prove Your Web3 Security Skills
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete security challenges from top Web3 companies and win prizes while getting recruited
          </p>
        </div>

        {!connected && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-yellow-300 font-medium">Connect Your Wallet</p>
                <p className="text-yellow-200/80 text-sm">
                  Please connect your Phantom wallet to start challenges
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.filter(q => q.isActive).map((quest) => (
            <div
              key={quest.id}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {quest.title}
                    </h3>
                    <p className="text-purple-400 font-medium">
                      {quest.companyName}
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-700 rounded-lg px-3 py-1">
                    <p className="text-green-400 font-bold text-sm">Active</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-2">
                  {quest.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">
                      ${quest.prizeAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">Prize</p>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">
                      {quest.stages.length}
                    </p>
                    <p className="text-xs text-gray-400">Stages</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">
                      {quest.currentWinners}/{quest.maxWinners}
                    </p>
                    <p className="text-xs text-gray-400">Winners</p>
                  </div>
                </div>

                <button
                  onClick={() => onStartQuest(quest.id)}
                  disabled={!connected || quest.currentWinners >= quest.maxWinners}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  {!connected 
                    ? 'Connect Wallet to Start'
                    : quest.currentWinners >= quest.maxWinners
                    ? 'Quest Full'
                    : 'Start Quest'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {quests.filter(q => q.isActive).length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No active quests available</p>
            <p className="text-gray-500 mt-2">Check back soon for new challenges!</p>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            <span className="text-purple-400 font-medium">Made using AImpact</span> © 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
