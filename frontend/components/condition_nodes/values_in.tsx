import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { Checkbox } from "antd"
import type { CheckboxValueType } from "antd/es/checkbox/Group"
import type { RootState } from "@/reducers"
import type { CascaderComponentType } from "@/types/table"
import type { NodeComponentProps } from "@/types/node"
import { SetNodePayload, actions as NodeActions } from "@/reducers/node"
import { NodeWrapperRemovable } from "@/components/condition_nodes"

export default function ValuesIn({
    table,
    groupId,
    nodeId,
    colName,
    colLabel,
    extra
}: NodeComponentProps)
{
    const options = extra?.options

    const nodeState = useSelector((state: RootState) => state.node)
    const dispatch = useDispatch()

    const [value1, setValue1] = useState<CheckboxValueType[]>([])

    useEffect(() => {
        const stringValue1 = JSON.stringify(value1).replaceAll("\"", '\'')

        const payload: SetNodePayload = {
            table,
            groupId,
            nodeId,
            nodeSpec: {
                component: ValuesIn,
                props: {table, groupId, nodeId, colName, colLabel, extra},
                queryString: `${colName} IN (${stringValue1.substring(1, stringValue1.length - 1)})`,
            }
        }
        dispatch(NodeActions.setNode(payload))
    }, [value1])

    return <NodeWrapperRemovable
        table={table}
        groupId={groupId}
        nodeId={nodeId}
        colName={colName}
        colLabel={colLabel}
    >
        <Checkbox.Group
            options={options} 
            defaultValue={value1}
            onChange={(checkedValues: CheckboxValueType[]) => {
                setValue1(checkedValues)
            }}
        >
        </Checkbox.Group>
    </NodeWrapperRemovable>
}

ValuesIn.getMeta = (extra?: CascaderComponentType["extra"]): CascaderComponentType => ({
    label: "조건 선택",
    value: "ValuesIn",
    component: ValuesIn,
    extra,
})