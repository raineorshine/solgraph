# solgraph
[![npm version](https://img.shields.io/npm/v/solgraph.svg)](https://npmjs.org/package/solgraph)
[![Build Status](https://travis-ci.org/raineorshine/solgraph.svg?branch=master)](https://travis-ci.org/raineorshine/solgraph)

Generate DOT graphs of function control flow from Solidity contracts.

## Install

```sh
$ npm install --save -g solgraph
```

## CLI

Given a Solidity contract:

```js
contract MyContract {
  function Foo() {}
  function Bar() {
    Foo();
  }
}
```

```sh
$ cat MyContract.sol | solgraph
Foo
Bar
Foo -> Bar
```

## Node Module

```js
import { readFileSync } from 'fs'
import solgraph from 'solgraph'

const dot = solgraph(fs.readFileSync('./MyContract.sol'))
console.log(dot)
/*
Foo
Bar
Foo -> Bar
*/
```

## License

ISC © [Raine Revere](https://github.com/raineorshine)
