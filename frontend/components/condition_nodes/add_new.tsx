import {
    useDispatch,
    // useSelector,
} from "react-redux"
import { CascaderProps, Cascader } from "antd"
import { SingleValueType } from "rc-cascader/lib/Cascader"

import type { AddNewNodeComponentProps, NodeComponentProps } from "@/types/node"
import { actions as NodeActions, SetNodePayload } from "@/reducers/node"
import { NodeWrapper } from "@/components/condition_nodes"
import { JK_CDP_TABLE_SPEC } from "@/config/table_spec"
import { DefaultOptionType } from "antd/es/cascader"

export function AddNew({table, groupId}: AddNewNodeComponentProps)
{
    const dispatch = useDispatch()
    // const baseNodeState = useSelector((state: RootState) => state.node)

    // 테이블 별 NodeType 정의
    const options = JK_CDP_TABLE_SPEC[table]

    // 컬럼 및 컴포넌트 선택시
    const onChange: CascaderProps["onChange"] = (item: SingleValueType, selectedOptions: any[]) => {
        const [attrObj, componentObj] = selectedOptions
        const {value: colName, label: colLabel} = attrObj
        const {value: compName, label: compLabel, component, extra} = componentObj

        if ( component ) {
            const nodeId = Date.now()
            const props: NodeComponentProps = {
                table,
                groupId,
                nodeId,
                colName,
                colLabel,
                extra
            }
            const payload: SetNodePayload = {
                table,
                groupId,
                nodeId,
                nodeSpec: { component, props }
            }
            dispatch(NodeActions.setNode(payload))
        }
    }

    return <NodeWrapper colLabel="새 조건">

        <Cascader
            options={options}
            onChange={onChange}
            showSearch={{
                filter: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some((option) => (option.label as string).toLowerCase().includes(inputValue))
            }}
            placeholder="조건을 선택해주세요"
        />

    </NodeWrapper>
}