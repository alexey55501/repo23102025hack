import { Quest, HackerProgress } from '../types';

const QUESTS_KEY = 'web3_security_quests';
const PROGRESS_KEY = 'hacker_progress';

export const questStore = {
  getQuests(): Quest[] {
    const stored = localStorage.getItem(QUESTS_KEY);
    return stored ? JSON.parse(stored) : getDefaultQuests();
  },

  saveQuests(quests: Quest[]): void {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  },

  getQuest(id: string): Quest | undefined {
    return this.getQuests().find(q => q.id === id);
  },

  addQuest(quest: Quest): void {
    const quests = this.getQuests();
    quests.push(quest);
    this.saveQuests(quests);
  },

  updateQuest(id: string, updates: Partial<Quest>): void {
    const quests = this.getQuests();
    const index = quests.findIndex(q => q.id === id);
    if (index !== -1) {
      quests[index] = { ...quests[index], ...updates };
      this.saveQuests(quests);
    }
  },

  deleteQuest(id: string): void {
    const quests = this.getQuests().filter(q => q.id !== id);
    this.saveQuests(quests);
  },

  getProgress(questId: string): HackerProgress | null {
    const stored = localStorage.getItem(`${PROGRESS_KEY}_${questId}`);
    return stored ? JSON.parse(stored) : null;
  },

  saveProgress(progress: HackerProgress): void {
    localStorage.setItem(`${PROGRESS_KEY}_${progress.questId}`, JSON.stringify(progress));
  },

  incrementWinners(questId: string): void {
    const quests = this.getQuests();
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      quest.currentWinners++;
      this.saveQuests(quests);
    }
  }
};

function getDefaultQuests(): Quest[] {
  return [
    {
      id: 'quest-1',
      companyName: 'SecureChain Labs',
      title: 'Smart Contract Auditor Challenge',
      description: 'Prove your skills by solving security puzzles and logic challenges',
      prizeAmount: 5000,
      maxWinners: 10,
      currentWinners: 3,
      isActive: true,
      createdAt: Date.now(),
      stages: [
        {
          id: 'stage-1',
          stageNumber: 1,
          title: 'Function Analysis',
          description: 'Analyze this function and find the output',
          challengeType: 'function',
          challenge: {
            type: 'function',
            prompt: 'What is the result of calling this function with input 42?',
            functionCode: `function mystery(x) {
  let result = x;
  for (let i = 0; i < 3; i++) {
    result = result * 2 + i;
  }
  return result;
}`,
            hint: 'Follow the loop iterations carefully'
          },
          correctCode: '339'
        },
        {
          id: 'stage-2',
          stageNumber: 2,
          title: 'Cipher Decryption',
          description: 'Decrypt the message to proceed',
          challengeType: 'cipher',
          challenge: {
            type: 'cipher',
            prompt: 'Decode this Caesar cipher (shift 3):',
            cipherText: 'VHFXULWB',
            hint: 'Each letter is shifted by 3 positions'
          },
          correctCode: 'SECURITY'
        },
        {
          id: 'stage-3',
          stageNumber: 3,
          title: 'Logic Puzzle',
          description: 'Solve the logical riddle',
          challengeType: 'logic',
          challenge: {
            type: 'logic',
            prompt: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies. What is the next number in sequence: 2, 6, 12, 20, 30, ?',
            hint: 'Look at the differences between consecutive numbers'
          },
          correctCode: '42'
        }
      ]
    },
    {
      id: 'quest-2',
      companyName: 'DeFi Security Inc',
      title: 'Protocol Security Expert',
      description: 'Advanced cryptographic and security challenges',
      prizeAmount: 8000,
      maxWinners: 5,
      currentWinners: 1,
      isActive: true,
      createdAt: Date.now(),
      stages: [
        {
          id: 'stage-1',
          stageNumber: 1,
          title: 'Hash Analysis',
          description: 'Find the pattern in the hash',
          challengeType: 'crypto',
          challenge: {
            type: 'crypto',
            prompt: 'What is the sum of all digits in this hex: 0x1A2B3C?',
            hint: 'Convert hex to decimal first'
          },
          correctCode: '21'
        },
        {
          id: 'stage-2',
          stageNumber: 2,
          title: 'Smart Contract Logic',
          description: 'Analyze the contract vulnerability',
          challengeType: 'function',
          challenge: {
            type: 'function',
            prompt: 'What value causes overflow in this Solidity-like function?',
            functionCode: `function check(uint8 x) {
  return x + 200;
}`,
            hint: 'uint8 max value is 255'
          },
          correctCode: '56'
        }
      ]
    }
  ];
}
