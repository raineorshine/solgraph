#! /usr/bin/env node

import com from 'commander'
import stdin from 'get-stdin-promise'
import pkg from './package.json'
import solgraph from './index.js'

const extendedHelp = `

${pkg.description}

Here is an example:
$ `

com
  .version(pkg.version)
  .usage(extendedHelp)
  .parse(process.argv)

stdin.then(input => {
  console.log(solgraph(input))
})
