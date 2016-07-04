import * as chai from 'chai'
import solgraph from '../index.js'
import { readFileSync } from 'fs'
const should = chai.should()

describe('solgraph', () => {
  it('should do something', () => {
    const dot = solgraph(readFileSync(__dirname + '/MyContract.sol', 'utf-8'))
    dot.should.equal(readFileSync(__dirname + '/MyContract.dot', 'utf-8'))
  })
})
