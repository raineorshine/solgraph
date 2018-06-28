import * as chai from 'chai'
import solgraph from '../src/index.js'
import { readFileSync } from 'fs'
const should = chai.should()

const load = filename => readFileSync(__dirname + '/' + filename, 'utf-8')
  .replace(/\r/g, '') // strip carriage returns for Windows support

describe('solgraph', () => {
  it('should generate DOT code that graphs function calls', () => {
    const dot = solgraph(load('in/Simple.sol'))
    dot.should.equal(load('out/Simple.dot'))
  })

  it('should highlight sends', () => {
    const dot = solgraph(load('in/Send.sol'))
    dot.should.equal(load('out/Send.dot'))
  })

  it('should highlight constant functions', () => {
    const dot = solgraph(load('in/Constant.sol'))
    dot.should.equal(load('out/Constant.dot'))
  })

  it('should highlight internal functions', () => {
    const dot = solgraph(load('in/Internal.sol'))
    dot.should.equal(load('out/Internal.dot'))
  })

  it('should support "emit" keyword', () => {
    const dot = solgraph(load('in/Emit.sol'))
    dot.should.equal(load('out/Emit.dot'))
  })

  it('should highlight view functions', () => {
    const dot = solgraph(load('in/View.sol'))
    dot.should.equal(load('out/View.dot'))
  })

  it('should highlight pure functions', () => {
    const dot = solgraph(load('in/Pure.sol'))
    dot.should.equal(load('out/Pure.dot'))
  })

  it('should highlight transfers', () => {
    const dot = solgraph(load('in/Transfer.sol'))
    dot.should.equal(load('out/Transfer.dot'))
  })

  it('should highlight payable functions', () => {
    const dot = solgraph(load('in/Payable.sol'))
    dot.should.equal(load('out/Payable.dot'))
  })

})
