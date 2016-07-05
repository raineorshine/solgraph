# solgraph
[![npm version](https://img.shields.io/npm/v/solgraph.svg)](https://npmjs.org/package/solgraph)
[![Build Status](https://travis-ci.org/raineorshine/solgraph.svg?branch=master)](https://travis-ci.org/raineorshine/solgraph)

Generate DOT graphs of function control flow in Solidity contracts.

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
# pipe in Solidity code, pipe out DOT file
$ cat MyContract.sol | solgraph > MyContract.dot
Foo
Bar
Foo -> Bar

# you have to install graphviz to render DOT file to an image
$ dot -Tpng MyContract.dot > MyContract.png
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
