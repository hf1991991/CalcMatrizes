import * as math from 'mathjs';

const hasVariables = (node: math.MathNode) => !!node.toString().match(/[a-i]/);

export default hasVariables;