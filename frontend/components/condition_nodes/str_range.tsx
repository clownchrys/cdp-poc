import { Input, Row } from "antd"
import { NodeComponentProps } from "@/types/node"
import { RootState } from "@/reducers"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { NodeWrapperRemovable } from "."
import { SetNodePayload, actions as NodeActions } from "@/reducers/node"
import { CascaderComponentType } from "@/types/table"

export default function StringRange({
    table,
    groupId,
    nodeId,
    colName,
    colLabel
}: NodeComponentProps)
{
    const nodeState = useSelector((state: RootState) => state.node)
    const dispatch = useDispatch()

    const [value1, setValue1] = useState("")
    const [value2, setValue2] = useState("")

    useEffect(() => {
        const payload: SetNodePayload = {
            table,
            groupId,
            nodeId,
            nodeSpec: {
                component: StringRange,
                props: {table, groupId, nodeId, colName, colLabel},
                queryString: `${colName} BETWEEN '${value1}' AND '${value2}'`,
            }
        }
        dispatch(NodeActions.setNode(payload))
    }, [value1, value2])

    return <NodeWrapperRemovable
        table={table}
        groupId={groupId}
        nodeId={nodeId}
        colName={colName}
        colLabel={colLabel}
    >
        <Row align="middle">
            <Input
                defaultValue={value1}
                onChange={(event) => setValue1(event.currentTarget.value)}
                style={{width: "auto"}}
            />
            <span style={{marginLeft: 10, marginRight: 10}}>에서</span>
            <Input
                defaultValue={value2}
                onChange={(event) => setValue2(event.currentTarget.value)}
                style={{width: "auto"}}
            />
            <span style={{marginLeft: 10, marginRight: 10}}>까지</span>
        </Row>
    </NodeWrapperRemovable>
}

StringRange.getMeta = (extra?: CascaderComponentType["extra"]): CascaderComponentType => ({
    label: "범위 비교 (문자열)",
    value: StringRange.name,
    component: StringRange,
    extra,
})