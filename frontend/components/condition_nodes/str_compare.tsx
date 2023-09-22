import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { SelectProps, Row, InputNumber, Select, Input } from "antd"
import { RootState } from "@/reducers"
import { NodeComponentProps } from "@/types/node"
import { CascaderComponentType } from "@/types/table"
import { actions as NodeActions, SetNodePayload } from "@/reducers/node"
import { NodeWrapperRemovable } from "."
import _ from "lodash"

export default function StringCompare({
    table,
    groupId,
    nodeId,
    colName,
    colLabel
}: NodeComponentProps)
{
    const operatorList = [
        {label: "와 같음", value: "="},
        {label: "를 포함함 (LIKE)", value: "LIKE"},
        {label: "를 포함하지 않음 (NOT LIKE)", value: "NOT LIKE"},
    ]

    const nodeState = useSelector((state: RootState) => state.node)
    const dispatch = useDispatch()

    const [operator, setOperator] = useState(operatorList[0]["value"])
    const [value1, setValue1] = useState("")

    useEffect(() => {
        const payload: SetNodePayload = {
            table,
            groupId,
            nodeId,
            nodeSpec: {
                component: StringCompare,
                props: {table, groupId, nodeId, colName, colLabel},
                queryString: `${colName} ${operator} '${value1}'`,
            }
        }
        dispatch(NodeActions.setNode(payload))
    }, [operator, value1])

    const options: SelectProps["options"] = operatorList.map(({label, value}, key) => ({
        key, label, value, icon: undefined
    }))

    return <NodeWrapperRemovable
        table={table}
        groupId={groupId}
        nodeId={nodeId}
        colName={colName}
        colLabel={colLabel}
    >
        <Row>
            <Input
                defaultValue={value1}
                // placeholder="포함 관계의 경우 LIKE 표현식을 입력해주세요"
                onChange={(event) => setValue1(event.currentTarget.value)}
                style={{ width: "auto" }}
            />
            <Select
                defaultValue={operator}
                options={options}
                onChange={(value) => setOperator(value)}
                style={{ minWidth: 130, marginLeft: 10 }}
            />
        </Row>
    </NodeWrapperRemovable>
}

StringCompare.getMeta = (extra?: CascaderComponentType["extra"]): CascaderComponentType => ({
    label: "문자열 비교",
    value: StringCompare.name,
    component: StringCompare,
    extra,
})