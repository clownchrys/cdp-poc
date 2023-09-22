import { SourceTable } from "./table"

export type NodeComponentProps = {
    table: SourceTable,
    groupId: number,
    nodeId: number,
    colLabel: string,
    colName: string,
    extra?: { [keys: string]: any }
}

export type AddNewNodeComponentProps = Pick<NodeComponentProps, "table" | "groupId">

export type NodeGroupComponentProps = Pick<NodeComponentProps, "table" | "groupId">
