export interface PhysicsProblem {
  topic: string;
  problem: string;
}

export interface ApiResponse {
  solution: string;
  error?: string;
}

export interface PhysicsTopic {
  id: string;
  name: string;
}