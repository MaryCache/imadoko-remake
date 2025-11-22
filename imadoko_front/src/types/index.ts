export type Position = "WS" | "MB" | "S" | "OP" | "Li";

export type Player = {
  id: number;
  firstName: string;
  lastName: string;
  position: Position;
};

export type Team = {
  id: number;
  teamName: string;
  players: Player[];
};

export type CourtSlotId = 1 | 2 | 3 | 4 | 5 | 6;

export type CourtAssignment = Record<CourtSlotId, Player | null>;

export type MatchScore = {
  sets: number;
  points: number;
  so: number; // Side Out
  br: number; // Break
};

export type ServeStatus = {
  team: 'A' | 'B' | null;
  server: Player | null;
  isValid: boolean;
  message?: string;
};

// APIエラーレスポンス型
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export type SetterRotationConfig = {
  setter: Player;
  targetPosition: CourtSlotId; // S1-S6 (1=S1, 2=S2, etc.)
  otherPlayers: Player[];
};
