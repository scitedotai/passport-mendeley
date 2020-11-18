# Contributing

Anyone is welcome to use, fork, submit issues, pull-requests, and contribute in other ways.

## Issues

If you find an issues with this project please submit an issue or pull request.

## Install

```
$ npm i
```

## lint

```
$ npm run lint:fix
```

## develop (with example)

1. Set env vars for your Mendeley Client ID and Secret
```
export MENDELEY_CLIENT_ID=<CLIENT_ID>
export MENDELEY_CLIENT_SECRET=<CLIENT_SECRET>
```

2. Modify the callback URL in example/index.js to be the one you have registed with your application (you can register localhost addresses)

3. Load up the example project
```
$ cd ../example
$ npm i
$ npm run dev
```
