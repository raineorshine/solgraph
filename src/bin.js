import com from 'commander'
import pkg from '../package.json'
import solgraph from './index.js'
import { readFile } from 'fs'

const extendedHelp = `

${pkg.description}

Example:
$ cat MyContract.sol | solgraph > MyContract.dot`

const program = com
  .version(pkg.version)
  .arguments('<file>')
  .usage(extendedHelp)
  .parse(process.argv)

const input = program.args[0]
  // filename from command line arguments
  ? new Promise((resolve, reject) => {
    readFile(program.args[0], 'utf-8', (err, data) => {
      if(err) { return reject(err) }
      resolve(data)
    })
  })
  // stdin
  : require('get-stdin-promise')

input.then(source => {
  const results = solgraph(source);
  for (let i = 0; i < results.length; i++) {
    console.log(results[i]);
  }
})
