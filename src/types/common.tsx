export interface Platform {
  id: string;
  name: string;
  abbreviation?: string;
}

export interface Genres {
  id: string;
  name: string;
}

export interface List {
  id?: number;
  name?: number;
}

export interface GameType {
  id: string;
  name: string;
  coverURL?: string;
  genresId?: number[];
  genres?: Genres[];
  platforms?: Platform[];
  platformsId?: number[];
  similarGames?: number[];
  list?: List;
}

export interface GameAndList {
  gameId: number;
  userList?: string;
  listId?: string;
}
