export enum UserType {
  STARTUP = 'startup',
  INVESTOR = 'investor',
}

export enum StartupStage {
  PRE_SEED = 'pre-seed',
  SEED = 'seed',
  SERIES_A = 'series-a',
  SERIES_B = 'series-b',
  SERIES_C = 'series-c',
  GROWTH = 'growth',
}

export enum InvestorType {
  ANGEL = 'angel',
  VC = 'vc',
  PE = 'pe',
  FAMILY_OFFICE = 'family-office',
  CORPORATE = 'corporate',
}

export enum MatchStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  CONNECTED = 'connected',
  REJECTED = 'rejected',
}

export enum SwipeDirection {
  LEFT = 'left',
  RIGHT = 'right',
}
