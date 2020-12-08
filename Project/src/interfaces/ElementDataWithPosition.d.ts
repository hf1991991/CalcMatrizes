import { ElementData, ExpressionData } from "../utilities/ExpressionClasses";

import * as math from 'mathjs';

interface ElementDataWithPosition {
    number: math.MathNode;
    row: number;
    column: number;
}

export default ElementDataWithPosition;