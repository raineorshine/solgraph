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
  dot[0].should.equal(load(`out/${name}.dot`))
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
  // 'Constructor',
  // 'Fallback'
]

describe('solgraph', () => {
  tests.forEach(test => {
    it(test.description || test.name || test, () => testInOut(test.name || test))
  });
  it('Issue bug 13 - should hangle multiple contracts in one file', () => {
    const dot = solgraph(load('in/issue13bug.sol'))
    dot[0].should.equal(load('out/issue13bug0.dot'))
    dot[1].should.equal(load('out/issue13bug1.dot'))
    dot[2].should.equal(load('out/issue13bug2.dot'))
  })
});
