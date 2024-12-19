export enum FetchType {
  NEVER = 0, // No fetch has been made
  CACHE = 1, // Fetch from the cache
  AUTO = 2, // Fetch from the cache if it's fresh, otherwise fetch from the server
  SERVER = 3, // Fetch from the server
}
