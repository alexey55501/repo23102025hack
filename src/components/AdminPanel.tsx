import { useState } from 'react';
import { Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { Quest, QuestStage } from '../types';
import { questStore } from '../data/questStore';

interface AdminPanelProps {
  quests: Quest[];
  onQuestsUpdate: () => void;
}

export function AdminPanel({ quests, onQuestsUpdate }: AdminPanelProps) {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCodes, setShowCodes] = useState<{ [key: string]: boolean }>({});

  const handleCreateQuest = () => {
    const newQuest: Quest = {
      id: `quest-${Date.now()}`,
      companyName: 'New Company',
      title: 'New Quest',
      description: 'Quest description',
      prizeAmount: 1000,
      maxWinners: 10,
      currentWinners: 0,
      isActive: true,
      createdAt: Date.now(),
      stages: []
    };
    questStore.addQuest(newQuest);
    setSelectedQuest(newQuest);
    setIsCreating(true);
    onQuestsUpdate();
  };

  const handleDeleteQuest = (id: string) => {
    if (confirm('Are you sure you want to delete this quest?')) {
      questStore.deleteQuest(id);
      setSelectedQuest(null);
      onQuestsUpdate();
    }
  };

  const handleUpdateQuest = (updates: Partial<Quest>) => {
    if (selectedQuest) {
      questStore.updateQuest(selectedQuest.id, updates);
      setSelectedQuest({ ...selectedQuest, ...updates });
      onQuestsUpdate();
    }
  };

  const handleAddStage = () => {
    if (!selectedQuest) return;

    const newStage: QuestStage = {
      id: `stage-${Date.now()}`,
      stageNumber: selectedQuest.stages.length + 1,
      title: 'New Stage',
      description: 'Stage description',
      challengeType: 'function',
      challenge: {
        type: 'function',
        prompt: 'What is the result?',
        functionCode: 'function example() {\n  return 42;\n}'
      },
      correctCode: '42'
    };

    const updatedStages = [...selectedQuest.stages, newStage];
    handleUpdateQuest({ stages: updatedStages });
  };

  const handleUpdateStage = (stageIndex: number, updates: Partial<QuestStage>) => {
    if (!selectedQuest) return;

    const updatedStages = selectedQuest.stages.map((stage, index) =>
      index === stageIndex ? { ...stage, ...updates } : stage
    );
    handleUpdateQuest({ stages: updatedStages });
  };

  const handleDeleteStage = (stageIndex: number) => {
    if (!selectedQuest) return;

    const updatedStages = selectedQuest.stages
      .filter((_, index) => index !== stageIndex)
      .map((stage, index) => ({ ...stage, stageNumber: index + 1 }));
    handleUpdateQuest({ stages: updatedStages });
  };

  const toggleShowCode = (stageId: string) => {
    setShowCodes(prev => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={handleCreateQuest}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Quest
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quests</h2>
            <div className="space-y-2">
              {quests.map(quest => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedQuest?.id === quest.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedQuest(quest);
                    setIsCreating(false);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{quest.companyName}</p>
                      <p className="text-sm opacity-80">{quest.title}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {quest.stages.length} stages • {quest.currentWinners}/{quest.maxWinners} winners
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuest(quest.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedQuest ? (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Quest</h2>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={selectedQuest.companyName}
                      onChange={(e) => handleUpdateQuest({ companyName: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Quest Title</label>
                    <input
                      type="text"
                      value={selectedQuest.title}
                      onChange={(e) => handleUpdateQuest({ title: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                      value={selectedQuest.description}
                      onChange={(e) => handleUpdateQuest({ description: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Prize Amount ($)</label>
                      <input
                        type="number"
                        value={selectedQuest.prizeAmount}
                        onChange={(e) => handleUpdateQuest({ prizeAmount: Number(e.target.value) })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Max Winners</label>
                      <input
                        type="number"
                        value={selectedQuest.maxWinners}
                        onChange={(e) => handleUpdateQuest({ maxWinners: Number(e.target.value) })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedQuest.isActive}
                      onChange={(e) => handleUpdateQuest({ isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-gray-300">Active Quest</label>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Stages</h3>
                    <button
                      onClick={handleAddStage}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stage
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedQuest.stages.map((stage, index) => (
                      <div key={stage.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-bold text-white">Stage {stage.stageNumber}</h4>
                          <button
                            onClick={() => handleDeleteStage(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            value={stage.title}
                            onChange={(e) => handleUpdateStage(index, { title: e.target.value })}
                            placeholder="Stage title"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                          />

                          <textarea
                            value={stage.description}
                            onChange={(e) => handleUpdateStage(index, { description: e.target.value })}
                            placeholder="Stage description"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm h-16"
                          />

                          <select
                            value={stage.challengeType}
                            onChange={(e) => handleUpdateStage(index, { 
                              challengeType: e.target.value as any,
                              challenge: { ...stage.challenge, type: e.target.value as any }
                            })}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                          >
                            <option value="function">Function Analysis</option>
                            <option value="cipher">Cipher Decryption</option>
                            <option value="logic">Logic Puzzle</option>
                            <option value="crypto">Cryptography</option>
                          </select>

                          <textarea
                            value={stage.challenge.prompt}
                            onChange={(e) => handleUpdateStage(index, {
                              challenge: { ...stage.challenge, prompt: e.target.value }
                            })}
                            placeholder="Challenge prompt"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm h-20"
                          />

                          {(stage.challengeType === 'function') && (
                            <textarea
                              value={stage.challenge.functionCode || ''}
                              onChange={(e) => handleUpdateStage(index, {
                                challenge: { ...stage.challenge, functionCode: e.target.value }
                              })}
                              placeholder="Function code"
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-green-400 text-sm font-mono h-32"
                            />
                          )}

                          {stage.challengeType === 'cipher' && (
                            <input
                              type="text"
                              value={stage.challenge.cipherText || ''}
                              onChange={(e) => handleUpdateStage(index, {
                                challenge: { ...stage.challenge, cipherText: e.target.value }
                              })}
                              placeholder="Cipher text"
                              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-yellow-400 text-sm font-mono"
                            />
                          )}

                          <input
                            type="text"
                            value={stage.challenge.hint || ''}
                            onChange={(e) => handleUpdateStage(index, {
                              challenge: { ...stage.challenge, hint: e.target.value }
                            })}
                            placeholder="Hint (optional)"
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-blue-300 text-sm"
                          />

                          <div className="flex gap-2">
                            <input
                              type={showCodes[stage.id] ? 'text' : 'password'}
                              value={stage.correctCode}
                              onChange={(e) => handleUpdateStage(index, { correctCode: e.target.value })}
                              placeholder="Correct code/answer"
                              className="flex-1 bg-gray-800 border border-green-700 rounded px-3 py-2 text-green-400 text-sm font-mono"
                            />
                            <button
                              onClick={() => toggleShowCode(stage.id)}
                              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-400 hover:text-white"
                            >
                              {showCodes[stage.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                <Edit className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Select a quest to edit or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
