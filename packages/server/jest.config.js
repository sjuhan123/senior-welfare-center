export default {
  preset: 'ts-jest', // 이 부분에서 ts-jest를 사용한다고 알려준다
  testEnvironment: 'node', //테스트 환경 'node' 환경을 사용한다 알려줌
  testMatch: ['<rootDir>/**/*.(spec|test).(js|jsx)'],
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.js'],
};
