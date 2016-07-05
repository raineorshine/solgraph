import * as chai from 'chai'
import solgraph from '../src/index.js'
import { readFileSync } from 'fs'
const should = chai.should()

const load = filename => readFileSync(__dirname + '/' + filename, 'utf-8')

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
})
