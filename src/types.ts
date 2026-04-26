export type Page = 'home' | 'predictions' | 'live' | 'slip' | 'predictors' | 'tools' | 'profile';

export interface UserAccount {
  id: string; // UUID from Supabase Auth
  username: string;
  displayName: string;
  bio?: string;
  email: string;
  joinedAt: string;
  avatarColor: string;
  stats: {
    totalSlips: number;
    accuracy: number;
    bestStreak: number;
    followers: number;
    following: number;
  };
}

export interface Reply {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  text: string;
  timeAgo: string;
}

export interface SlipComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  text: string;
  timeAgo: string;
  replies: Reply[];
}

export interface PostedSlip {
  id: string;
  userId: string;
  predictorUsername: string;
  selections: SlipSelection[];
  totalOdds: number;
  timestamp: string;
  agrees: number;
  disagrees: number;
  status: 'Pending' | 'Won' | 'Lost' | 'Live';
  accuracy?: number;
  caption?: string;
  comments: SlipComment[];
}
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  league: string;
  time: string;
  predictedScore: string;
  predictedOutcome: string;
  winProb: number;
  drawProb: number;
  lossProb: number;
  over25: number;
  btts: number;
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
  h2h: string;
  confidence: 'High' | 'Medium' | 'Low';
  status: 'upcoming' | 'live' | 'finished';
  liveScore?: { home: number; away: number };
  liveMinute?: number;
  finalScore?: { home: number; away: number };
  predictionCorrect?: null | boolean;
}

export interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  league: string;
  minute: string;
  isLive: boolean;
  status: string;
}

export interface Predictor {
  rank: number;
  username: string;
  displayName: string;
  name?: string;
  bio: string;
  avatar: string;
  predictions: number;
  correct: number;
  accuracy: number;
  streak: number;
  isVerified: boolean;
  followers: number;
  following: number;
  joinedAt: string;
}

export interface CommunityPrediction {
  id: string;
  username: string;
  match: string;
  selection: string;
  confidence: 'Low' | 'Medium' | 'High';
  time: string;
  agrees: number;
  disagrees: number;
  status?: 'Pending' | 'Win' | 'Loss';
}

export interface SlipSelection {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  odds: number;
  status?: 'Pending' | 'Won' | 'Lost' | 'Live';
}
