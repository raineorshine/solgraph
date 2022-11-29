const solparser = require('@solidity-parser/parser');
import { Graph } from  'graphlib'
import * as dot from  'graphlib-dot'

const SEND_NODE_NAME = 'UNTRUSTED'
const SEND_NODE_STYLE = { shape: 'rectangle' }

const COLORS = {
  SEND: 'red',
  CONSTANT: 'blue',
  CALL: 'orange',
  INTERNAL: 'gray',
  VIEW: 'yellow',
  PURE: 'green',
  TRANSFER: 'purple',
  PAYABLE: 'brown'
}

const prop = name => object => object[name]
const propEquals = (name, values) => object => Array.isArray(values) ?
    values.includes(object[name]) :
    object[name] === values 
const wrap = val => Array.isArray(val) ? val : [val]

/** Converts an AST to array. */
const flatten = ast => {
  const children = wrap(ast.body || ast.expression || ast.left || ast.right || ast.literal || [])
  return [ast].concat(...children.map(flatten))
}

/** Finds all call expression nodes in an AST. */
const callees = node => {
  if (!(node.body && node.body.statements)) return []
  const {statements} = node.body
  return statements.filter(statement => 
      statement.type === 'EmitStatement' ||
      (statement.type === 'ExpressionStatement' && statement.expression.type === 'FunctionCall') &&
      !['require', 'assert'].includes(statement.expression.expression.name) 
  )
}

/** Determines the name of the graph node to render from the AST node. */
const graphNodeName = name => {
  return name === 'send' ? SEND_NODE_NAME : name
}
const handleSpecials = node => {
  if (node.isConstructor) {
    node.name = 'constructor'
  } else if( node.isFallback) {
    node.name = 'fallback'
  }
}

export default source => {

  // parse the Solidity source
  let ast
  try {
    ast = solparser.parse(source)
  } catch (e) {
    console.error('Parse error. Please report to https://github.com/sc-forks/solidity-parser.')
    console.error(e)
    process.exit(1)
  }

  // get a list of all function nodes
  const contracts = ast.children.filter(child => child.type === 'ContractDefinition')
const functionAndEventNodes = contracts.map(contract=>contract.subNodes).flat()
    .filter(propEquals('type', ['FunctionDefinition', 'EventDefinition']))

  // analyze the security of the functions
  const analyzedNodes = functionAndEventNodes.map(node => {
    const functionCallees = callees(node)
      .map(statement => {
        switch(statement.type ) {
          case "EmitStatement": 
            return statement.eventCall.expression.name  
          case "ExpressionStatement": 
            const expression = statement.expression.expression
            if (expression.name) return statement.expression.expression.name
            if (expression.type === 'MemberAccess') 
              return expression.memberName
              //TODO: if expression.expression.type === 'MemberAccess'
              //            expression.expression.memberName
              //      if expression.expression.type === 'Identifier'
              //            expression.expression.name
        }
      })

    //CONSTRUCTOR
    if (!node.name) {
      handleSpecials(node)
    
    }

    return {
      name: graphNodeName(node.name),
      callees:functionCallees,
      send: functionCallees.some(callee => callee === 'send'),
      transfer: functionCallees.some(callee => callee === 'transfer'),
      constant: node.stateMutability && node.stateMutability === 'constant',
      internal: node.visibility && node.visibility === 'internal',
      view: node.stateMutability && node.stateMutability === 'view',
      pure: node.stateMutability && node.stateMutability === 'pure',
      payable: node.stateMutability && node.stateMutability === 'payable',
      event: node.type && node.type === 'EventDefinition'
    }
  })

  // generate a graph
  var digraph = new Graph()
  analyzedNodes.forEach(({ name, callees, send, constant, internal, view, pure, transfer, payable, event }) => {

    // node
    digraph.setNode(graphNodeName(name),
      event ? { shape: 'polygon'} :
      send ? { color: COLORS.SEND } :
      constant ? { color: COLORS.CONSTANT } :
      internal ? { color: COLORS.INTERNAL } :
      view ? { color: COLORS.VIEW } :
      pure ? { color: COLORS.PURE } :
      transfer ? { color: COLORS.TRANSFER } :
      payable ? { color: COLORS.PAYABLE } :
      {}
    )

    // edge
    callees.forEach(callee => {
      digraph.setEdge(name, graphNodeName(callee))
    })
  })

  // add send node
  if(analyzedNodes.some(prop('send'))) {
    digraph.setNode(SEND_NODE_NAME, SEND_NODE_STYLE)
  }

  return dot.write(digraph)
}
