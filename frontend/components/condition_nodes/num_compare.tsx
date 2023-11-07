import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { SelectProps, Row, InputNumber, Select } from "antd"
import { RootState } from "@/reducers"
import { NodeComponentProps } from "@/types/node"
import { CascaderComponentType } from "@/types/table"
import { actions as NodeActions, SetNodePayload } from "@/reducers/node"
import { NodeWrapperRemovable } from "."
import _ from "lodash"
import { stringFormat } from "@/utils"

export default function NumberCompare({
    table,
    groupId,
    nodeId,
    colName,
    colLabel
}: NodeComponentProps)
{
    const operatorList = [
        {label: "와 같음", value: "= {0}"},
        {label: "와 같지 않음", value: "!= {0}"},
        {label: "보다 큼", value: "> {0}"},
        {label: "보다 크거나 같음", value: ">= {0}"},
        {label: "보다 작음", value: "< {0}"},
        {label: "보다 작거나 같음", value: "<= {0}"},
    ]

    // const nodeState = useSelector((state: RootState) => state.node)
    const dispatch = useDispatch()

    const [operator, setOperator] = useState(operatorList[0]["value"])
    const [value1, setValue1] = useState(0)

    useEffect(() => {
        const payload: SetNodePayload = {
            table,
            groupId,
            nodeId,
            nodeSpec: {
                component: NumberCompare,
                props: {table, groupId, nodeId, colName, colLabel},
                queryString: `${colName} ${stringFormat(operator, value1)}`,
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
            <InputNumber
                defaultValue={value1}
                onChange={(value) => setValue1(value!)}
            />
            <Select
                defaultValue={operator}
                options={options}
                onChange={(value) => setOperator(value)}
                style={{ minWidth: 130, marginLeft: 5 }}
            />
        </Row>
    </NodeWrapperRemovable>
}

NumberCompare.getMeta = (extra?: CascaderComponentType["extra"]): CascaderComponentType => ({
    label: "단일 비교 (숫자)",
    value: NumberCompare.name,
    component: NumberCompare,
    extra,
})