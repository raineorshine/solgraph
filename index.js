import * as solparser from 'solidity-parser'
import { Graph } from  'graphlib'
import * as dot from  'graphlib-dot'

const prop = propertyName => object => object[propertyName]

/** Converts an AST to array. */
const astToArray = ast => {
  const children = Array.isArray(ast.body) ? ast.body :
    ast.body ? [ast.body] :
    ast.expression ? [ast.expression] :
    ast.left ? [ast.left] :
    ast.literal ? [ast.literal] :
    []
  return [ast].concat(...children.map(astToArray))
}

/** Finds all call expression nodes in an AST. */
const calls = ast => {
  return astToArray(ast).filter(node => {
    return node.type === 'CallExpression'
  })
}

export default source => {

  // parse the Solidity source
  const ast = solparser.parse(source)

  // get a list of all function nodes
  const functionNodes = astToArray(ast).filter(node => {
    return node.type === 'FunctionDeclaration'
  })

  // analyze the security of the functions
  const analyzedNodes = functionNodes.map(node => ({
    name: node.name,
    calls: calls(node).map(node => node.callee.name)
  }))

  // generate a graph
  var digraph = new Graph()
  analyzedNodes.forEach(({ name, calls }) => {
    digraph.setNode(name)
    calls.forEach(call => {
      digraph.setEdge(name, call)
    })
  })
  // digraph.setEdge(1, 2, { label: "A label" })

  return dot.write(digraph)
}
