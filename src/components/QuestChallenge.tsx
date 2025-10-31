import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Trophy, Code, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Quest, HackerProgress } from '../types';
import { questStore } from '../data/questStore';

interface QuestChallengeProps {
  quest: Quest;
  onBack: () => void;
}

export function QuestChallenge({ quest, onBack }: QuestChallengeProps) {
  const { connected, publicKey } = useWallet();
  const [progress, setProgress] = useState<HackerProgress>(() => {
    const saved = questStore.getProgress(quest.id);
    return saved || {
      questId: quest.id,
      currentStage: 0,
      completedStages: [],
      startedAt: Date.now()
    };
  });

  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStage = quest.stages[progress.currentStage];

  useEffect(() => {
    questStore.saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!connected) {
      onBack();
    }
  }, [connected, onBack]);

  const handleSubmit = () => {
    if (!currentStage) return;

    const isCorrect = userInput.trim().toUpperCase() === currentStage.correctCode.toUpperCase();

    if (isCorrect) {
      const newCompletedStages = [...progress.completedStages, progress.currentStage];
      const nextStage = progress.currentStage + 1;

      if (nextStage >= quest.stages.length) {
        setIsCompleted(true);
        questStore.incrementWinners(quest.id);
        setFeedback({
          type: 'success',
          message: '🎉 Congratulations! You completed the quest!'
        });
      } else {
        setProgress({
          ...progress,
          currentStage: nextStage,
          completedStages: newCompletedStages
        });
        setFeedback({
          type: 'success',
          message: '✅ Correct! Moving to next stage...'
        });
        setUserInput('');
        setTimeout(() => setFeedback(null), 2000);
      }
    } else {
      setFeedback({
        type: 'error',
        message: '❌ Incorrect code. Try again!'
      });
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
          <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to participate in this quest
          </p>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800 rounded-xl border border-green-500 p-8 text-center">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Quest Completed!</h1>
          <p className="text-xl text-gray-300 mb-6">
            You've successfully completed all stages of the {quest.title} quest!
          </p>
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <p className="text-gray-400 mb-2">Your Prize</p>
            <p className="text-5xl font-bold text-green-400 mb-4">${quest.prizeAmount}</p>
            <p className="text-gray-300 mb-4">
              You will be contacted by {quest.companyName} for the final interview round.
            </p>
            {publicKey && (
              <div className="bg-gray-950 rounded-lg p-4 mt-4">
                <p className="text-gray-400 text-sm mb-1">Your Wallet</p>
                <p className="text-purple-400 font-mono text-sm break-all">
                  {publicKey.toBase58()}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quests
        </button>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{quest.title}</h2>
            <div className="text-right">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-lg font-bold text-purple-400">
                Stage {progress.currentStage + 1} / {quest.stages.length}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {quest.stages.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  progress.completedStages.includes(index)
                    ? 'bg-green-500'
                    : index === progress.currentStage
                    ? 'bg-purple-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {publicKey && (
            <div className="bg-gray-900 rounded-lg p-3 mt-4">
              <p className="text-gray-400 text-xs mb-1">Connected Wallet</p>
              <p className="text-purple-400 font-mono text-sm break-all">
                {publicKey.toBase58()}
              </p>
            </div>
          )}
        </div>

        {currentStage && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentStage.title}</h3>
                <p className="text-gray-400">{currentStage.description}</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <p className="text-gray-300 mb-4 text-lg">{currentStage.challenge.prompt}</p>
              
              {currentStage.challenge.functionCode && (
                <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto mb-4">
                  <code className="text-green-400 text-sm">{currentStage.challenge.functionCode}</code>
                </pre>
              )}

              {currentStage.challenge.cipherText && (
                <div className="bg-gray-950 p-4 rounded-lg mb-4">
                  <p className="text-yellow-400 text-xl font-mono text-center">
                    {currentStage.challenge.cipherText}
                  </p>
                </div>
              )}

              {currentStage.challenge.hint && (
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    💡 Hint: {currentStage.challenge.hint}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Enter the code:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Type your answer here..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {feedback && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-lg ${
                    feedback.type === 'success'
                      ? 'bg-green-900/20 border border-green-700 text-green-300'
                      : 'bg-red-900/20 border border-red-700 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <p>{feedback.message}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
