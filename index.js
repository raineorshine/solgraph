import * as solparser from 'solidity-parser'
import { Graph } from  'graphlib'
import * as dot from  'graphlib-dot'

const SEND_NODE_NAME = 'UNTRUSTED'

const COLORS = {
  SEND: 'red',
  CONSTANT: 'blue',
  CALL: 'orange',
  INTERNAL: 'gray'
}

const prop = propertyName => object => object[propertyName]

/** Converts an AST to array. */
const flattten = ast => {
  const children = Array.isArray(ast.body) ? ast.body :
    ast.body ? [ast.body] :
    ast.expression ? [ast.expression] :
    ast.left ? [ast.left] :
    ast.right ? [ast.right] :
    ast.literal ? [ast.literal] :
    []
  return [ast].concat(...children.map(flattten))
}

/** Finds all call expression nodes in an AST. */
const callees = ast => {
  return flattten(ast).filter(node => {
    return node.type === 'CallExpression'
  })
}

/** Determines the name of the graph node to render from the AST node. */
const graphNodeName = name => {
  return name === 'send' ? SEND_NODE_NAME : name
}

export default source => {

  // parse the Solidity source
  const ast = solparser.parse(source)

  // console.log(JSON.stringify(ast, null, 2))

  // get a list of all function nodes
  const functionNodes = flattten(ast).filter(node => {
    return node.type === 'FunctionDeclaration'
  })

  // analyze the security of the functions
  const analyzedNodes = functionNodes.map(node => {
    const functionCallees = callees(node).map(node => node.callee)
    return {
      name: graphNodeName(node.name),
      callees:functionCallees,
      send: functionCallees.some(callee => {
        const calleeName = callee.property && callee.property.name || callee.name
        return calleeName === 'send'
      }),
      constant: node.modifiers && node.modifiers.some(modifier => {
        return modifier.name === 'constant'
      })
    }
  })

  // console.log(JSON.stringify(analyzedNodes, null, 2))

  // generate a graph
  var digraph = new Graph()
  analyzedNodes.forEach(({ name, callees, send, constant }) => {
    const graphNode = graphNodeName(name)
    digraph.setNode(graphNode,
      send ? { color: COLORS.SEND } :
      constant ? { color: COLORS.CONSTANT } :
      {}
    )
    callees.forEach(callee => {
      const calleeName = callee.property && callee.property.name || callee.name
      digraph.setEdge(name, graphNodeName(calleeName))
    })
  })
  // digraph.setEdge(1, 2, { label: "A label" })

  return dot.write(digraph)
}
