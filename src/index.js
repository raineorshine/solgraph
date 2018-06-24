import * as solparser from 'solidity-parser'
import { Graph } from  'graphlib'
import * as dot from  'graphlib-dot'

const SEND_NODE_NAME = 'UNTRUSTED'
const SEND_NODE_STYLE = { shape: 'rectangle' }

const COLORS = {
  SEND: 'red',
  VIEW: 'blue',
  PURE: 'green',
  CALL: 'orange',
  CONSTANT: 'purple',
  INTERNAL: 'gray'
}

const prop = name => object => object[name]
const propEquals = (name, value) => object => object[name] === value
const wrap = val => Array.isArray(val) ? val : [val]

/** Converts an AST to array. */
const flatten = ast => {
  const children = wrap(ast.body || ast.expression || ast.left || ast.right || ast.literal || [])
  return [ast].concat(...children.map(flatten))
}

/** Finds all call expression nodes in an AST. */
const callees = ast => {
  return flatten(ast).filter(node => {
    return node.type === 'CallExpression'
  })
}

/** Determines the name of the graph node to render from the AST node. */
const graphNodeName = name => {
  return (name === 'send' || name === 'transfer') ? SEND_NODE_NAME : name
}

export default source => {

  // parse the Solidity source
  let ast
  try {
    ast = solparser.parse(source)
  } catch (e) {
    console.error('Parse error')
    console.error(e)
    process.exit(1)
  }

  // get a list of all function nodes
  const functionNodes = flatten(ast).filter(propEquals('type', 'FunctionDeclaration'))

  // analyze the security of the functions
  const analyzedNodes = functionNodes.map(node => {
    const functionCallees = callees(node).map(node => node.callee)
    return {
      name: graphNodeName(node.name),
      callees:functionCallees,
      send: functionCallees.some(callee => {
        const calleName = callee.name || callee.property && callee.property.name
        return calleName === 'send' || calleName === 'transfer'
      }),
      view: node.modifiers && node.modifiers.some(propEquals('name', 'view')),
      pure: node.modifiers && node.modifiers.some(propEquals('name', 'pure')),
      constant: node.modifiers && node.modifiers.some(propEquals('name', 'constant')),
      internal: node.modifiers && node.modifiers.some(propEquals('name', 'internal'))
    }
  })

  // console.log(JSON.stringify(ast, null, 2))
  // console.log(JSON.stringify(analyzedNodes, null, 2))

  // generate a graph
  var digraph = new Graph()
  analyzedNodes.forEach(({ name, callees, send, view, pure, constant, internal }) => {

    // node
    digraph.setNode(graphNodeName(name),
      send ? { color: COLORS.SEND } :
      view ? { color: COLORS.VIEW } :
      pure ? { color: COLORS.PURE } :
      constant ? { color: COLORS.CONSTANT } :
      internal ? { color: COLORS.INTERNAL } :
      {}
    )

    // edge
    callees.forEach(callee => {
      const calleeName = callee.property && callee.property.name || callee.name
      digraph.setEdge(name, graphNodeName(calleeName))
    })
  })

  // add send node
  if(analyzedNodes.some(prop('send')) || analyzedNodes.some(prop('transfer'))) {
    digraph.setNode(SEND_NODE_NAME, SEND_NODE_STYLE)
  }

  return dot.write(digraph)
}
