import * as solparser from 'solidity-parser-antlr'
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
  const children = wrap(ast.children || ast.subNodes || ast.body || ast.statements || ast.expression || [])
  return [ast].concat(...children.map(flatten))
}

/** Finds all call expression nodes in an AST. */
const callees = ast => {
  return flatten(ast).filter(node => {
    return node.type === 'FunctionCall'
  })
}

/** Finds all local values access nodes in an AST. */
const membercalls = ast => {
  return flatten(ast).filter(node => {
    return node.type === 'MemberAccess'
  })
}

/** Finds all event calls in an AST. */
const eventcalls = ast => {
  return flatten(ast).filter(node => {
    return node.type === 'EmitStatement'
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
  const functionNodes = flatten(ast).filter(propEquals('type', 'FunctionDefinition'))

  // analyze the security of the functions
  const analyzedNodes = functionNodes.map(node => {
    const functionCallees = callees(node).filter(callees)
    return {
      name: graphNodeName(node.name),
      callees:functionCallees,
      send: membercalls(node).some(callee => {
        const calleName = callee.name || callee.memberName
        return calleName === 'send' || calleName === 'transfer'
      }),
      view: node.stateMutability && propEquals('stateMutability', 'view')(node),
      pure: node.stateMutability && propEquals('stateMutability', 'pure')(node),
      constant: node.stateMutability && propEquals('stateMutability', 'constant')(node),
      internal: node.visibility && propEquals('visibility', 'internal')(node),
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
      const calleeName = (callee.expression && (callee.expression.name || callee.expression.memberName)) || callee.name || callee.memberName
      digraph.setEdge(name, graphNodeName(calleeName))
    })
  })

  // add send node
  if(analyzedNodes.some(prop('send')) || analyzedNodes.some(prop('transfer'))) {
    digraph.setNode(SEND_NODE_NAME, SEND_NODE_STYLE)
  }

  return dot.write(digraph)
}
