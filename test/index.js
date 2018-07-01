import * as chai from 'chai'
import solgraph from '../src/index.js'
import { readFileSync } from 'fs'
const should = chai.should()

/** Load a text file from the current directory */
const load = filename => readFileSync(__dirname + '/' + filename, 'utf-8')
  .replace(/\r/g, '') // strip carriage returns for Windows support

/** Test that the processed input .sol file matches the output .dot file. */
const testInOut = name => {
  const dot = solgraph(load(`in/${name}.sol`))
  dot.should.equal(load(`out/${name}.dot`))
}

/** Array of test files and descriptions. */
const tests = [
  'Simple',
  'Send',
  'Constant',
  'Internal',
  'Emit',
  'View',
  'Pure',
  'Transfer',
  'Payable',
  'Constructor',
  'Fallback'
]

describe('solgraph', () => {
  tests.forEach(test => {
    it(test.description || test.name || test, () => testInOut(test.name || test))
  })
})
