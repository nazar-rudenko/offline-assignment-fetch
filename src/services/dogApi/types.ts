export type AuthParams = {
  email: string;
  name: string;
};

export type PaginationParams = {
  size?: number;
  from?: number;
  sort?: { field: string; order: "asc" | "desc" };
};

export type SearchDogParams = PaginationParams & {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
};
