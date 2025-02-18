export const DOMAINS = {
  LOCAL: "http://localhost:5173",
  API: "https://frontend-take-home-service.fetch.com",
  DEPLOYMENT: "https://offline-assignment-fetch.vercel.app",
};

export const PATHS = {
  BASE: DOMAINS.API,
  PROXY: `${DOMAINS.DEPLOYMENT}/api`,
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  DOGS: {
    LIST: "/dogs",
    BREEDS: "/dogs/breeds",
    SEARCH: "/dogs/search",
    MATCH: "/dogs/match",
  },
  LOCATIONS: {
    LIST: "/locations",
    SEARCH: "/locations/search",
  },
};
