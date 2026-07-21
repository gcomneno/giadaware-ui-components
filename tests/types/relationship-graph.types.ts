import { RelationshipGraph } from '../../src/lib/visitor/index.js';
import type { RelationshipGraphActivation, RelationshipGraphEdge, RelationshipGraphNode, RelationshipGraphProps, RelationshipGraphSelection } from '../../src/lib/visitor/index.js';
const node: RelationshipGraphNode={id:'a',label:'Alpha',image:'/a.png',href:'/a'}; const edge:RelationshipGraphEdge={source:'a',target:'b',type:'shared',label:'Supports'};
const props:RelationshipGraphProps={nodes:[node],edges:[edge],ariaLabel:'Map',emptyLabel:'Empty',class:'consumer',style:'height:20rem',onnodeselect:(detail:RelationshipGraphSelection)=>detail.node.id, onnodeactivate:(detail:RelationshipGraphActivation)=>detail.source};
// @ts-expect-error node id is required
const invalidNode:RelationshipGraphNode={label:'Bad'};
// @ts-expect-error edge target is required
const invalidEdge:RelationshipGraphEdge={source:'a'};
// @ts-expect-error callback receives a detail object, not a node
const invalidProps:RelationshipGraphProps={onnodeselect:(value:string)=>value};
void [RelationshipGraph,node,edge,props,invalidNode,invalidEdge,invalidProps];
