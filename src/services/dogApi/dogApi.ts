import http from "../http.ts";
import { PATHS } from "./consts.ts";
import type { Dog, SearchDogsResponse, MatchedDog } from "./dtos.ts";
import type { AuthParams, SearchDogParams } from "./types.ts";

export const auth = ({ email, name }: AuthParams) =>
  http<void>({
    method: "POST",
    path: PATHS.AUTH.LOGIN,
    body: {
      email,
      name,
    },
  });

export const logout = () =>
  http<void>({
    method: "POST",
    path: PATHS.AUTH.LOGOUT,
  });

export const fetchBreeds = () =>
  http<[string]>({
    method: "GET",
    path: PATHS.DOGS.BREEDS,
  });

const searchAbortController = new AbortController();

export const searchDogs = async (params: SearchDogParams) => {
  searchAbortController.abort();

  const { resultIds, total } = await http<SearchDogsResponse>({
    method: "GET",
    path: PATHS.DOGS.SEARCH,
    params,
    signal: searchAbortController.signal,
  });
  const dogs = await http<[Dog]>({
    method: "POST",
    path: PATHS.DOGS.LIST,
    body: resultIds,
    signal: searchAbortController.signal,
  });

  return { dogs, total };
};

export const matchDogs = (dogIds: [string]) =>
  http<MatchedDog>({
    method: "POST",
    path: PATHS.DOGS.MATCH,
    body: dogIds,
  });
