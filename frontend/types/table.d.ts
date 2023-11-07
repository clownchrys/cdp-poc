import { NodeComponentProps } from "@/types/node"

export type SourceTable = 
    "jk_dev_cdp_poc_db.cdp_jk_base_table" |
    "jk_dev_cdp_poc_db.cdp_jk_working_table" |
    "jk_dev_cdp_poc_db.cdp_jk_activity_table" |
    "jk_dev_cdp_poc_db.cdp_jk_marketing_agree_table"

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
