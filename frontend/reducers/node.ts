import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NodeComponentProps } from "@/types/node";
import { SourceTable } from "@/types/table";

/* Atoms */

// Node
// Single node to represent a where condition
export type BaseNodeSpec = {
    component: React.FC<NodeComponentProps>,
    props: NodeComponentProps,
    display: boolean,
    queryString?: string,
}
export type ToQueryNodeSpec = Omit<Required<BaseNodeSpec>, "display">

// Node Group
// A set of nodes (combined with AND)
export type NodeGroupSpec<NodeSpec> = {
    [nodeId: number]: NodeSpec
}

// Node Group Stack
// A set of node group (combined with OR)
export type NodeGroupStackSpec<NodeSpec> = {
    [groupId: number]: NodeGroupSpec<NodeSpec>
}

/** State
 * 
 * {
 *      "tableName": {
 *          "orNodes": {
 *              "andNodes": {  }
 *          }
 *      }
 * }
 */

export type NodeState<NodeSpec> = {
    [table in SourceTable]: NodeGroupStackSpec<NodeSpec>
}

/* Payloads */

export type SetNodePayload = {
    table: keyof NodeState<BaseNodeSpec>,
    groupId: number,
    nodeId: number,
    nodeSpec: Omit<BaseNodeSpec, "display">
}

export type UnsetNodePayload = {
    table: keyof NodeState<BaseNodeSpec>,
    groupId: number,
    nodeId: number,
}

/* Actions, Reducer */

export const {actions, reducer} = createSlice({
    name: "node",

    initialState: {
        "jk_dev_cdp_poc_db.cdp_jk_base_table": {},
        "jk_dev_cdp_poc_db.cdp_jk_working_table": {},
        "jk_dev_cdp_poc_db.cdp_jk_activity_table": {},
        "jk_dev_cdp_poc_db.cdp_jk_marketing_agree_table": {},
    } as NodeState<BaseNodeSpec>,

    reducers: {
        setNode(state, action: PayloadAction<SetNodePayload>): NodeState<BaseNodeSpec> {
            const {type, payload} = action
            const {table, groupId, nodeId, nodeSpec} = payload

            // get new states
            const newState = {...state}
            const newTableState = {...newState[table]}
            const newNodeGroupState = {...newTableState[groupId]}

            // add node
            newNodeGroupState[nodeId] = { ...nodeSpec, display: true }

            // set new state
            newTableState[groupId] = newNodeGroupState
            newState[table] = newTableState
            return newState
        },

        unsetNode(state, action: PayloadAction<UnsetNodePayload>): NodeState<BaseNodeSpec> {
            const {type, payload} = action
            const {table, groupId, nodeId} = payload

            // get new states
            const newState = {...state}
            const newTableState = {...newState[table]}
            const newNodeGroupState = {...newTableState[groupId]}
            const newNodeState = {...newNodeGroupState[nodeId]}

            // remove node
            newNodeState.display = false
            newNodeState.queryString = undefined

            // set new state
            newNodeGroupState[nodeId] = newNodeState
            newTableState[groupId] = newNodeGroupState
            newState[table] = newTableState
            return newState
        },
    }
})
