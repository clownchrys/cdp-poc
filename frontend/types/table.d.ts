import { NodeComponentProps } from "@/types/node"

export type SourceTable = 
    "jk_dev_cdp_poc_db.cdp_base_table_ik_0830" |
    "jk_dev_cdp_poc_db.cdp_working_table_ik_0830" |
    "jk_dev_cdp_poc_db.cdp_activity_table_ik_0830" |
    "jk_dev_cdp_poc_db.cdp_marketing_agree_table_ik_0830"

// AddNew Cascader Types
export type CascaderColumnType = {
    value: string,
    label: string,
    children: CascaderComponentType[],
}

export type CascaderComponentType = {
    value: string,
    label: string,
    component: React.FC<NodeComponentProps>,
    extra?: NodeComponentProps["extra"],
}

export type TableAttributeSpec = {
    [keys in SourceTable]: CascaderProps<CascaderColumnType>["options"]
}
