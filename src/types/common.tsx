export interface Platform {
  id: string;
  name: string;
  abbreviation?: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface List {
  id?: number;
  name?: number;
}

export interface GameAndList {
  id: number;
  list?: List;
  gameInfo: GameSimplified;
}

export interface GameSimplified {
  id: number;
  name: string;
  coverURL?: string;
  genres?: Genre[];
  platforms?: Platform[];
}
