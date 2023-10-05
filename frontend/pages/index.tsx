/* eslint-disable */

import _ from "lodash"
import { CSSProperties, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios, { AxiosResponse } from "axios"
import { Button, ButtonProps, Card, Col, Divider, Layout, Row, Spin, Statistic, Table } from "antd"
import { ColumnsType } from "antd/es/table"
import CountUp from "react-countup"
import IframeResizer from "iframe-resizer-react"

import type { RootState } from "@/reducers"
import type { SourceTable } from "@/types/table"
import type { BaseNodeSpec, NodeState } from "@/reducers/node"
import { NodeGroupStackComponent } from "@/components/condition_nodes"
import { getValidState as getStateToQuery, state2query } from "@/utils"
import { JK_CDP_TABLE_NAME_MAPPER } from "@/config/table_spec"
import * as APIQueryToAthena from "@/pages/api/query_to_athena"
import * as APISaveToMongo from "@/pages/api/save_to_mongo"

type TableDataType = {
    table: string,
    conditions: string
}

type UserSizeType = {
    value?: number,
    updated?: string,
    queryId?: APISaveToMongo.ResponseType["result"],
    loading: boolean
}

export default function Index() {
    const STREAMLIT_URI = process.env.NEXT_PUBLIC_STREAMLIT_URI

    const state: NodeState<BaseNodeSpec> = useSelector((state: RootState) => state.node)
    const stateToQuerify = getStateToQuery(state)

    const initSize: UserSizeType = { loading: false, queryId: undefined }
    const [totalSize, setTotalSize] = useState<UserSizeType>(initSize)
    const [currentSize, setCurrentSize] = useState<UserSizeType>(initSize)

    useEffect(() => {
        setTotalSize({ ...totalSize, loading: true })

        const queryReq: APIQueryToAthena.RequestType = {
            query: "SELECT count(1) AS cnt FROM jk_dev_cdp_poc_db.cdp_base_table_ik_0830"
        }

        axios.post("/api/query_to_athena", queryReq)
        .then(({data: {result, query}}: AxiosResponse<APIQueryToAthena.ResponseType>) => {
            // console.log(query)
            setTotalSize({
                value: result.Items[0].cnt,
                updated: new Date().toLocaleString(),
                loading: false,
            })
        })
        .catch((reason) => {
            // alert(reason)
            console.log({ reason, error: "query failed on totalSize" })
            setTotalSize({ ...currentSize, loading: false, queryId: undefined })
        })
    }, [])

    const calcTargetSize: ButtonProps["onClick"] = async (event) => {
        if (_.isEmpty(stateToQuerify)) { alert("유효한 쿼리 노드가 존재하지 않습니다.") }
        else {
            setCurrentSize({ ...currentSize, loading: true, queryId: undefined })

            const countReq: APIQueryToAthena.RequestType = {
                query: state2query(stateToQuerify, "\n", "count(pr_mem_id) AS cnt"),
            }
            // console.log(countReq.query)

            try {
                const countResp: APIQueryToAthena.ResponseType = ( await axios.post("/api/query_to_athena", countReq) ).data

                const count = countResp.result.Items[0].cnt
                const updated = new Date().toLocaleString()
                setCurrentSize({ ...currentSize, value: count, updated: updated, loading: false, queryId: undefined })

            } catch (reason) {
                alert("쿼리를 실행하는 도중 오류가 발생했습니다. 관리자에게 문의해주세요.")
                console.log({ reason, error: "query failed on currentSize" })
                setCurrentSize({ ...currentSize, loading: false, queryId: undefined })
            }
        }
    }

    const doAnalyze: ButtonProps["onClick"] = async (event) => {
        const memReq: APISaveToMongo.RequestType = {
            query: state2query(stateToQuerify, " ", "pr_mem_id"),
        }
        // console.log(memReq.query)

        try {
            const memResp: APISaveToMongo.ResponseType = ( await axios.post("/api/save_to_mongo", memReq) ).data
            setCurrentSize({ ...currentSize, queryId: memResp.result })

        } catch (reason) {
            alert("쿼리를 저장하는 도중 오류가 발생했습니다. 관리자에게 문의해주세요.")
            console.log({ reason, error: "mongo failed on currentSize" })
        }

    }

    const columns: ColumnsType<TableDataType> = [
        {
            title: "데이터 소스",
            dataIndex: "table",
            key: "table",
            width: 300,
            render: (value) =>
                <span style={{ fontWeight: "bold", fontSize: 15 }}>
                    { JK_CDP_TABLE_NAME_MAPPER[value as SourceTable] }
                </span>
        },
        {
            title: "조건",
            dataIndex: "conditions",
            key: "conditions",
            render: (value) =>
                <NodeGroupStackComponent table={ value as SourceTable } />
        },
    ]

    const dataSource: TableDataType[] = Object.keys(state).map((tableName) => ({
        table: tableName,
        conditions: tableName
    }))

    const formatter = (value: number | string) => <CountUp end={value as number} separator="," />

    const marginVertical: CSSProperties = {
        marginTop: 30,
        marginBottom: 30,
    }

    return (
        <Layout style={{ backgroundColor: "transparent", height: "100%" }}>

            {/* 헤더 */}
            <div style={{marginBottom: 30, marginLeft: "auto", marginRight: "auto"}}>
                <span style={{ fontSize: 30, fontWeight: "bold" }}>
                    CDP Demo Page :)
                </span>
            </div>

            {/* 테이블 */}
            <Table
                columns={ columns }
                dataSource={ dataSource }
                pagination={ false }
            />

            {/* 서브밋 */}
            <Row justify="end" style={{ ...marginVertical }}>
                <Button
                    type="primary"
                    onClick={ calcTargetSize }
                    style={{ marginTop: 10 }}
                >
                    타겟 측정
                </Button>
                <Button
                    onClick={ doAnalyze }
                    style={{ marginTop: 10 }}
                >
                    타겟 분석
                </Button>
            </Row>

            {/* 타겟 분석 완료시 */}
            {
                ! _.isUndefined(currentSize.queryId)
                && <Divider style={{ ...marginVertical }}>
                    아래 타겟 분석 결과를 확인해주세요.
                </Divider>
            }

            {/* 타겟 측정 결과 */}
            <Row gutter={16} style={{ ...marginVertical }}>
                <Col span={12}>
                    <Card bordered style={{ minHeight: 130, borderColor: "black", borderWidth: 1 }}>
                        <Spin tip="데이터를 측정하고 있습니다..." size="large" spinning={currentSize.loading}>
                            <Statistic
                                title="대상 유저"
                                value={ currentSize.value }
                                suffix="명"
                                formatter={ formatter }
                            />
                            <span style={{ color: "#80808059" }}>{ currentSize.updated ?? "업데이트 되지 않음" }</span>
                        </Spin>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered style={{ borderColor: "black", borderWidth: 1 }}>
                        <Spin tip="데이터를 측정하고 있습니다..." size="large" spinning={totalSize.loading}>
                            <Statistic
                                title="전체 유저"
                                value={ totalSize.value }
                                suffix="명"
                                formatter={ formatter }
                            />
                            <span style={{ color: "#80808059" }}>{ totalSize.updated ?? "업데이트 되지 않음" }</span>
                        </Spin>
                    </Card>
                </Col>
            </Row>

            {/* 타겟 분석 완료시 */}
            {
                ! _.isUndefined(currentSize.queryId)
                && <IframeResizer
                    src={ `${STREAMLIT_URI}?query_id=${currentSize.queryId}` }
                    heightCalculationMethod="lowestElement"
                    scrolling={ false }
                    style={{ ...marginVertical, border: "none", minWidth: "100%" }}
                    inPageLinks
                />
            }

        </Layout>
    )
}