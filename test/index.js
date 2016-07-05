import * as chai from 'chai'
import solgraph from '../index.js'
import { readFileSync } from 'fs'
const should = chai.should()

const load = filename => readFileSync(__dirname + '/' + filename, 'utf-8')

describe('solgraph', () => {
  it('should generate DOT code that graphs function calls', () => {
    const dot = solgraph(load('Simple.sol'))
    dot.should.equal(load('Simple.dot'))
  })

  it.only('should highlight sends', () => {
    const dot = solgraph(load('Send.sol'))
    dot.should.equal(load('Send.dot'))
  })
})
