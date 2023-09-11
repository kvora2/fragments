# Fragments

## Description

Welcome!! we will be exploring and starting our journey with Cloud computing by implementing some of the common but useful libraries and dependencies in Project that we'll be using and working on moving forward. So Let's get started 🦾🤖

## Getting Started

_Note:_ The Project creation and installation of dependencies are performed on MacOS so many activities/procedures might differ from Windows

### Pre-requisites

- Quick heads up on necessary dependencies and packages for our Project: `Prettier`, `ESLint`, `pino`, `Express`, `Stoppable` (recommended for exiting server gracefully when shut off), `jq` (for filtering, formatting, beautifying and sometimes transforming JSON response), `nodemon` (Let's stay up-to-date without restarting again and again)

### Installing

- npm Setup

```sh
npm init -y
npm install
```

After running try reaching server at http://localhost:8080

- Prettier Setup

```sh
npm install --save-dev --save-exact prettier
```

> NOTE: We can create an `.prettierrc` file to provide some config to apply to the files of this project (Just save your file and Prettier will take care of it 💫)and also we can create an .prettierignore to specify which files to ignore when applying this configs (everything goes in root dir)

- ESLint Setup
  Purpose of using --save-dev here: ESLint will be a Development Dependency, not needed in production

```sh
npm install --save-dev eslint
npx eslint --init
```

- Structured Logging and Pino Setup
  In Cloud Environments, we will be using structured Logging of needed activities

```
npm install --save pino pino-pretty pino-http
```

> NOTE: use --save to have the dependencies added to package.json automatically

- Express App Setup

```
npm install --save express cors helmet compression
```

- Nodemon

```
npm install --save-dev nodemon
```

## Structure

```plaintext
.
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc
├── .vscode
│   ├── launch.json
│   └── settings.json
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── app.js
    ├── logger.js
    └── server.js
```

## Reference

1. [Cloud Computing Lab 01](https://github.com/humphd/cloud-computing-for-programmers-fall-2023/blob/main/labs/lab-01/README.md)
2. [Documentation Structure](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)
