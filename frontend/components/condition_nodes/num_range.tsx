import { InputNumber, Row } from "antd"
import { NodeComponentProps } from "@/types/node"
import { RootState } from "@/reducers"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { NodeWrapperRemovable } from "."
import { SetNodePayload, actions as NodeActions } from "@/reducers/node"
import { CascaderComponentType } from "@/types/table"

export default function NumberRange({
    table,
    groupId,
    nodeId,
    colName,
    colLabel
}: NodeComponentProps)
{
    const nodeState = useSelector((state: RootState) => state.node)
    const dispatch = useDispatch()

    const [value1, setValue1] = useState(0)
    const [value2, setValue2] = useState(0)

    useEffect(() => {
        const payload: SetNodePayload = {
            table,
            groupId,
            nodeId,
            nodeSpec: {
                component: NumberRange,
                props: {table, groupId, nodeId, colName, colLabel},
                queryString: `${colName} BETWEEN ${value1} AND ${value2}`,
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
            <InputNumber
                defaultValue={value1}
                onChange={(value) => setValue1(value!)}
            />
            <span style={{marginLeft: 10, marginRight: 10}}>에서</span>
            <InputNumber
                defaultValue={value2}
                onChange={(value) => setValue2(value!)}
            />
            <span style={{marginLeft: 10, marginRight: 10}}>까지</span>
        </Row>
    </NodeWrapperRemovable>
}

NumberRange.getMeta = (extra?: CascaderComponentType["extra"]): CascaderComponentType => ({
    label: "범위 비교 (숫자)",
    value: "NumberRange",
    component: NumberRange,
    extra,
})