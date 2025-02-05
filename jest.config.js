export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TypeScript files with ts-jest
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JS files with babel-jest
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Handle alias like "@/components"
  },
  testEnvironment: "jsdom", // Use jsdom for front-end testing
  transformIgnorePatterns: [
    "/node_modules/(?!your-esm-library-to-transform).+\\.js$",
  ],
};
