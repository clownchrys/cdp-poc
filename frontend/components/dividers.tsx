import { Card, Divider } from "antd"

export function OR() {
    return <Divider
        type="horizontal"
        style={{
            borderColor: "rgba(0, 0, 0, 0.2)",
            marginTop: 30,
            marginBottom: 30
        }}
        dashed
    >OR</Divider>
}

export function AND() {
    return <Card bordered={false} style={{boxShadow: "none", background: "transparent"}}>
        <span className="ant-divider-inner-class" style={{fontWeight: "bold"}}>AND</span>
    </Card>
}
