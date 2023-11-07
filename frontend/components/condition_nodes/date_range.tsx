import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { DatePicker } from "antd"
import dayjs from "dayjs"
import type { RootState } from "@/reducers"
import type { CascaderComponentType } from "@/types/table"
import { NodeComponentProps } from "@/types/node"
import { NodeWrapperRemovable } from "."
import { actions as NodeActions, SetNodePayload } from "@/reducers/node"

const KST_TIMEZONE = 9 * 60 * 60 * 1000
const DATE_DELIMITER = "-"
const DATE_FORMAT = `YYYY${DATE_DELIMITER}MM${DATE_DELIMITER}DD`

export default function DateRange({
    table,
    groupId,
    nodeId,
    colName,
    colLabel
}: NodeComponentProps)
{
    // const nodeState = useSelector((state: RootState) => state.node)
    const dispatch = useDispatch()

    const now: string = new Date(Date.now() + KST_TIMEZONE)
        .toISOString()
        .replaceAll("-", DATE_DELIMITER)
        .split("T")[0]
    const [value1, setValue1] = useState(now)
    const [value2, setValue2] = useState(now)

    useEffect(() => {
        const payload: SetNodePayload = {
            table,
            groupId,
            nodeId,
            nodeSpec: {
                component: DateRange,
                props: {table, groupId, nodeId, colName, colLabel},
                queryString: `${colName} BETWEEN DATE '${value1}' AND DATE '${value2}'`,
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
        <DatePicker.RangePicker
            defaultValue={[
                dayjs(value1, DATE_FORMAT),
                dayjs(value2, DATE_FORMAT),
            ]}
            format={DATE_FORMAT}
            showTime={false}
            onChange={(values, formatString) => {
                const [start, end] = formatString
                setValue1(start)
                setValue2(end)
            }}
        />
    </NodeWrapperRemovable>
}

DateRange.getMeta = (extra?: CascaderComponentType["extra"]): CascaderComponentType => ({
    label: "범위 비교 (날짜)",
    value: "DateRange",
    component: DateRange,
    extra,
})