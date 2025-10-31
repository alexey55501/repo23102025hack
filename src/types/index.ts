export interface Quest {
  id: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  prizeAmount: number;
  maxWinners: number;
  currentWinners: number;
  stages: QuestStage[];
  isActive: boolean;
  createdAt: number;
}

export interface QuestStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  challengeType: 'function' | 'cipher' | 'logic' | 'crypto';
  challenge: Challenge;
  correctCode: string;
}

export interface Challenge {
  type: 'function' | 'cipher' | 'logic' | 'crypto';
  prompt: string;
  hint?: string;
  functionCode?: string;
  cipherText?: string;
  logicPuzzle?: string;
}

export interface HackerProgress {
  questId: string;
  currentStage: number;
  completedStages: number[];
  startedAt: number;
}
