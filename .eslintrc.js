const path = require("path");

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
  ],
  plugins: ["prettier", "react-hooks", "@emotion"],
  rules: {
    // Prettier에 대한 설정입니다. Prettier가 지정한 규칙을 위반하는 경우 에러로 표시됩니다.
    "prettier/prettier": "error",

    // 프로젝트에 필요하지 않은 의존성을 허용하지 않는 규칙입니다. 특정 파일 유형에 대해 개발 의존성을 명시하는 규칙이 설정되어 있습니다.
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.stories.tsx",
          "**/*.@(spec|test).@(js|ts)?(x)",
          "**/testUtils.tsx",
          "**/jest.setup.ts",
          "**/.storybook/*.@(js|ts)?(x)",
          "**/webpack.*.js",
          "**/script/*.js",
          "**/mocks/**/*.@(js|ts)?(x)",
        ],
      },
    ],

    // React Hooks 규칙 중 사용법에 관한 규칙을 정의합니다. Hooks를 올바르게 사용하지 않은 경우 에러로 표시됩니다.
    "react-hooks/rules-of-hooks": "error",

    // useEffect나 useCallback과 같은 Hook에서 의존성 배열이 완전한지 확인하는 규칙입니다. 모든 의존성이 포함되지 않은 경우 경고를 발생시킵니다.
    "react-hooks/exhaustive-deps": "warn",

    // JSX를 사용할 때 React를 import 할 필요가 있는지 여부를 정의합니다. 이 규칙은 비활성화되어 있으므로 JSX에서 React를 직접 import할 필요가 없습니다.
    "react/react-in-jsx-scope": "off",

    // JSX 속성을 전파할 때 확장 연산자를 사용하는 것을 허용하는지 여부를 결정합니다. 이 규칙은 비활성화되어 있으므로 확장 연산자를 사용할 수 있습니다.
    "react/jsx-props-no-spreading": "off",

    // JSX를 포함한 파일 확장자의 유효성을 정의합니다. '.tsx', '.jsx', 'spec.js' 확장자를 허용하며, 그 외에는 에러를 발생시킵니다.
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".tsx", ".jsx", "spec.js"] },
    ],

    // 함수 컴포넌트의 정의 방식을 지정하는 규칙입니다. 이 규칙은 비활성화되어 있으므로 함수 컴포넌트의 정의 방식에 대한 제약이 없습니다.
    "react/function-component-definition": "off",

    // 동일한 모듈이 여러 번 임포트되는 것을 허용할지 여부를 결정합니다. 비활성화되어 있으므로 동일한 모듈의 중복 임포트가 허용됩니다.
    "import/no-duplicates": "off",

    // 파일의 확장자에 대한 규칙을 정의합니다. 일부 패키지를 무시하고 확장자를 사용하지 않도록 설정되어 있습니다.
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],

    // import 문의 순서를 지정하는 규칙입니다. import문을 특정 그룹으로 구분하고 정렬하는 방법을 지정합니다.
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "[@]common/**",
            group: "external",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],

    // label 엘리먼트가 관련된 제어 요소를 가지고 있는지 확인하는 규칙입니다. 제어 요소가 없는 label에 대해 에러를 발생시킵니다.
    "jsx-a11y/label-has-associated-control": [
      "error",
      { controlComponents: ["input", "select"] },
    ],
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      extends: [
        "plugin:@typescript-eslint/recommended",
        // ?
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "react/prop-types": "off",
        "react/require-default-props": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
          "error",
          { variables: false },
        ],
      },
      parserOptions: {
        project: ["./tsconfig.json", "./packages/**/tsconfig.json"],
      },
    },
    {
      files: ["packages/client/**/*.ts?(x)", "packages/client/**/*.js?(x)"],
      settings: {
        "import/resolver": {
          typescript: {
            project: path.resolve(`${__dirname}/packages/client/tsconfig.json`),
          },
        },
      },
    },
  ],
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx", "spec.js"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts", ".js", ".jsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
