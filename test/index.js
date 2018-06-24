import * as chai from 'chai'
import solgraph from '../src/index.js'
import { readFileSync } from 'fs'
const should = chai.should()

const load = filename => readFileSync(__dirname + '/' + filename, 'utf-8');
const platFormAgnostic = file => file.replace(/\r|\n/g, '').replace(/\n/g, '');

describe('solgraph', () => {
  it('should generate DOT code that graphs function calls', () => {
    const dot = solgraph(load('in/Simple.sol'))
    platFormAgnostic(dot).should.equal(platFormAgnostic(load('out/Simple.dot')))
  })

  it('should highlight sends', () => {
    const dot = solgraph(load('in/Send.sol'))
    platFormAgnostic(dot).should.equal(platFormAgnostic(load('out/Send.dot')))
  })

  it('should highlight constant functions', () => {
    const dot = solgraph(load('in/Constant.sol'))
    platFormAgnostic(dot).should.equal(platFormAgnostic(load('out/Constant.dot')))
  })

  it('should highlight pure functions', () => {
    const dot = solgraph(load('in/Pure.sol'))
    platFormAgnostic(dot).should.equal(platFormAgnostic(load('out/Pure.dot')))
  })

  it('should highlight view functions', () => {
    const dot = solgraph(load('in/View.sol'))
    platFormAgnostic(dot).should.equal(platFormAgnostic(load('out/View.dot')))
  })

  it('should highlight internal functions', () => {
    const dot = solgraph(load('in/Internal.sol'))
    platFormAgnostic(dot).should.equal(platFormAgnostic(load('out/Internal.dot')))
  })

  // it('should support "emit" keyword', () => {
  //   const dot = solgraph(load('in/Emit.sol'))
  //   dot.should.equal(load('out/Emit.dot'))
  // })
})
