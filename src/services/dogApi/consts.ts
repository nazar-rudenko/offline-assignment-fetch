const withPrefix = (
  base: string,
  paths: Record<string, string>,
): Record<keyof typeof paths, string> =>
  Object.entries(paths).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: `${base}${value}` }),
    {},
  );

export const PATHS = {
  AUTH: withPrefix("/auth", {
    LOGIN: "/login",
    LOGOUT: "/logout",
  }),
  DOGS: withPrefix("/dogs", {
    LIST: "",
    BREEDS: "/breeds",
    SEARCH: "/search",
    MATCH: "/match",
  }),
  LOCATIONS: withPrefix("/locations", {
    LIST: "",
    SEARCH: "/search",
  }),
};
