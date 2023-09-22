import React from "react"
import { Card, Row } from "antd"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/reducers"
import type { SourceTable } from "@/types/table"
import type { NodeComponentProps, NodeGroupComponentProps } from "@/types/node"
import { BaseNodeSpec, actions as NodeActions, NodeGroupSpec, NodeGroupStackSpec, UnsetNodePayload } from "@/reducers/node"
import { AND, OR } from "@/components/dividers"
import { AddNew } from "@/components/condition_nodes/add_new"
import { Entries } from "type-fest"

export function NodeWrapper({children, colLabel}: React.PropsWithChildren & Pick<NodeComponentProps, "colLabel">) {
    return <Card
        size="small"
        title={ colLabel }
        style={{
            width: "fit-content",
            height: "fit-content",
        }}
    >
        { children }
    </Card>
}

export function NodeWrapperRemovable({children, table, groupId, nodeId, colLabel}: React.PropsWithChildren & NodeComponentProps) {
    const dispatch = useDispatch()

    const doDelete: React.DOMAttributes<HTMLAnchorElement>["onClick"] = () => {
        const payload: UnsetNodePayload = {
            table, groupId, nodeId
        }
        dispatch(NodeActions.unsetNode(payload))
    }

    return <Card
        size="small"
        title={ colLabel }
        extra={ <a onClick={doDelete}>삭제</a> }
        style={{
            minWidth: 200,
            maxWidth: "fit-content",
            maxHeight: "fit-content",
            borderColor: "black",
            borderWidth: 1
        }}
        headStyle={{ background: "rgba(141, 241, 129, 0.3)" }}
        bodyStyle={{ background: "rgba(141, 241, 129, 0.3)" }}
    >
        { children }
    </Card>
}

export function NodeGroupComponent({table, groupId}: NodeGroupComponentProps) {
    const nodeGroup: NodeGroupSpec<BaseNodeSpec> = useSelector((state: RootState) => state.node[table][groupId]) || {}

    const nodeComponentList = ( Object.entries(nodeGroup) as unknown as Entries<typeof nodeGroup> ).map(([nodeId, node]) => {
        if (node.display) {
            return <>
                <node.component
                    key={`${groupId}/${nodeId}`}
                    {...node.props}
                />
                <AND/>
            </> 
        } else {
            return <></>
        }
    })

    const newNodeId = Date.now()

    nodeComponentList.push(
        <AddNew
            key={`${groupId}/${newNodeId}`}
            table={table}
            groupId={groupId}
        />
    )

    return <Row>{ nodeComponentList }</Row>
}

export function NodeGroupStackComponent({table}: Pick<NodeGroupComponentProps, "table">) {
    const nodeGroupStack: NodeGroupStackSpec<BaseNodeSpec> = useSelector((state: RootState) => state.node[table])

    const nodeGroupComponentList = ( Object.entries(nodeGroupStack) as unknown as Entries<typeof nodeGroupStack> ).map(([groupId, nodeGroup], index) => {
        const validNodeSpecs = Object.values(nodeGroup).filter((node) => node.display)

        if ( validNodeSpecs.length ) {
            return <>
                <NodeGroupComponent
                    key={groupId}
                    table={table}
                    groupId={groupId}
                />
                <OR/>
            </>
        } else {
            return <></>
        }
    })

    const newGroupId = Date.now()

    nodeGroupComponentList.push(
        <NodeGroupComponent
            key={newGroupId}
            table={table as SourceTable}
            groupId={newGroupId}
        />
    )

    return <>{ nodeGroupComponentList }</>
}
