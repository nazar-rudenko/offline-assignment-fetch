export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};

export type SearchDogsResponse = {
  resultIds: [string];
  total: number;
  next: string;
  prev: string;
};

export type MatchedDog = {
  match: string;
};

export type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

export type Coordinates = {
  lat: number;
  lon: number;
};
