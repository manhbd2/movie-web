import { TMDBContentTypes } from "./tmdb";

export enum MWMediaType {
  MOVIE = "movie",
  SERIES = "series",
}

export type MWSeasonMeta = {
  id: string;
  number: number;
  title: string;
};

export type MWSeasonWithEpisodeMeta = {
  id: string;
  number: number;
  title: string;
  episodes: {
    id: string;
    number: number;
    title: string;
  }[];
};

type MWMediaMetaBase = {
  title: string;
  id: string;
  year?: string;
  poster?: string;
};

type MWMediaMetaSpecific =
  | {
      type: MWMediaType.MOVIE;
      seasons: undefined;
    }
  | {
      type: MWMediaType.SERIES;
      seasons: MWSeasonMeta[];
      seasonData: MWSeasonWithEpisodeMeta;
    };

export type MWMediaMeta = MWMediaMetaBase & MWMediaMetaSpecific;

export interface MWQuery {
  searchQuery: string;
}

export interface DetailedMeta {
  meta: MWMediaMeta;
  imdbId?: string;
  tmdbId?: string;
}

export interface MetaRequest {
  id: string;
  type: TMDBContentTypes;
  season?: number | undefined;
  episode?: number | undefined;
  seasonId?: string | undefined;
}

export interface IServer {
  name: string;
  hash: string;
}

export interface IServerResponse {
  data: IServer[];
}
