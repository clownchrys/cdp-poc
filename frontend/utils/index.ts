import _ from "lodash"
import { Entries } from "type-fest"
import { NodeGroupSpec, NodeGroupStackSpec, BaseNodeSpec, NodeState, ToQueryNodeSpec } from "@/reducers/node"

export function stringFormat(source: string, ...args: any) {
    return source.replace(
        /\{(\d+)\}/g,
        (match: string, index: number) => args[index]
    )
}

export function index2char(index: number) {
  const start: number = 'A'.charCodeAt(0)
  return String.fromCharCode(start + index)
}

export function getValidState(state: NodeState<BaseNodeSpec>): Partial<NodeState<ToQueryNodeSpec>> {
  const newState: Partial<NodeState<ToQueryNodeSpec>> = {}

  for (const [table, nodeGroupStack] of Object.entries(state) as Entries<typeof state>) {
    const newNodeGroupStack: NodeGroupStackSpec<ToQueryNodeSpec> = {}

    for (const [groupId, nodeGroup] of Object.entries(nodeGroupStack) as unknown as Entries<typeof nodeGroupStack>) {
      const entries = Object.entries(nodeGroup) as unknown as Entries<typeof nodeGroup>
      const filteredEntries = entries.filter(([nodeId, node]) => node.display && node.queryString)
      const newNodeGroup = Object.fromEntries(filteredEntries) as NodeGroupSpec<ToQueryNodeSpec>

      if (!_.isEmpty(newNodeGroup)) { newNodeGroupStack[groupId] = newNodeGroup }
    }

    if (!_.isEmpty(newNodeGroupStack)) { newState[table] = newNodeGroupStack }
  }

  return newState
}

export function state2query(
  validState: ReturnType<typeof getValidState>,
  sep: string = " ", // use "\n" to check query on your eyes
  output_col: string = "count(pr_mem_id) AS cnt"
): string
{
  const eachTableQueryList = []

  // Process Each OR Conditions (NodeGroupStack)
  for (const [tableName, nodeGroupStack] of Object.entries(validState) as Entries<typeof validState>) {
    const andQueryList = []

    // Process Each AND Conditions (NodeGroup)
    for (const nodeGroup of Object.values(nodeGroupStack || {})) {
      let andQuery: string;

      let queryStringList = Object.values(nodeGroup).map((node) => node.queryString)

      // 1. AGG 테이블
      if (tableName == "jk_dev_cdp_poc_db.cdp_jk_activity_table") {
        const dateRange = queryStringList.filter((queryString) => queryString.startsWith("dt"))
        queryStringList = queryStringList.filter((queryString) => !queryString.startsWith("dt"))

        const innerSelectExpr = `SELECT pr_mem_id, sum(gno_view_cnt) AS gno_view_cnt, sum(apply_cnt) AS apply_cnt, sum(scrap_cnt) AS scrap_cnt`
        const innerFromExpr = `FROM ${tableName}`
        const innerWhereExpr = _.isEmpty(dateRange) ? "" : `WHERE ${dateRange.join(" AND ")}`
        const innerQuery = `${innerSelectExpr}${sep}${innerFromExpr}${sep}${innerWhereExpr}${sep}GROUP BY 1`

        const outerSelectExpr = `SELECT pr_mem_id`
        const outerFromExpr = `FROM (${sep}${innerQuery}${sep})`
        const outerWhereExpr = _.isEmpty(queryStringList) ? "" : `WHERE ${queryStringList.join(" AND ")}`

        andQuery = `${outerSelectExpr}${sep}${outerFromExpr}${sep}${outerWhereExpr}`
      }

      // 2. 일반 테이블
      else {
        const outerSelectExpr = `SELECT pr_mem_id`
        const outerFromExpr = `FROM ${tableName}`
        const outerWhereExpr = _.isEmpty(queryStringList) ? "" : `WHERE ${queryStringList.join(" AND ")}`

        andQuery = `${outerSelectExpr}${sep}${outerFromExpr}${sep}${outerWhereExpr}`
      }

      andQueryList.push(andQuery)
    }

    let orQuery;
    orQuery = andQueryList.join(`\n\t\tUNION ALL -- OR\n`) // OR == UNION ALL
    orQuery = `\n---------- Processing Table: ${tableName} ----------\n${orQuery}`

    if (orQuery) { eachTableQueryList.push(orQuery) }
  }

  // console.log(eachTableQueryList[0])
  // console.log(eachTableQueryList[1])

  // 각 테이블을 SELECT 또는 JOIN 하기 위한 함수
  const fnAggregateQuery = (query: string, index: number) => {
    const startAlias = index2char(0)
    const currentAlias = index2char(index)

    const selectExpr = `SELECT DISTINCT ${currentAlias}.pr_mem_id`
    const fromExpr = `FROM (${sep}${query}${sep}) AS ${currentAlias}`
    const joinExpr = `JOIN (${sep}${query}${sep}) AS ${currentAlias}`
    const onExpr = `ON ${startAlias}.pr_mem_id = ${currentAlias}.pr_mem_id`

    return index == 0 ? `${selectExpr}${sep}${fromExpr}` : `${sep}${joinExpr} ${onExpr}`
  }

  // 데이터 쿼리
  const dataQuery = eachTableQueryList.map(fnAggregateQuery).join(sep)

  return `SELECT ${output_col} FROM (\n\n${dataQuery}\n\n) AS SOURCE_TABLE`
}

// export function state2query(
//   validState: ReturnType<typeof getValidState>,
//   sep: string = " ", // use "\n" to check query on your eyes
//   output_col: string = "count(pr_mem_id) AS cnt"
// ): string
// {
//   const eachTableQueryList = []

//   // Process Each OR Conditions (NodeGroupStack)
//   for (const [tableName, nodeGroupStack] of Object.entries(validState) as Entries<typeof validState>) {
//     const andQueryList = []

//     // Process Each AND Conditions (NodeGroup)
//     for (const nodeGroup of Object.values(nodeGroupStack || {})) {
//       let fromTable;
//       let whereCond;

//       const queryStringList = Object.values(nodeGroup).map((node) => node.queryString)

//       // 1. AGG 테이블
//       if (tableName == "jk_dev_cdp_poc_db.cdp_jk_activity_table") {
//         const innerWhereCond = queryStringList.filter((queryString) => queryString.startsWith("dt")).join(" AND ")
//         fromTable = (!_.isEmpty(innerWhereCond))
//           ?  `(SELECT pr_mem_id, sum(gno_view_cnt) AS gno_view_cnt, sum(apply_cnt) AS apply_cnt, sum(scrap_cnt) AS scrap_cnt FROM ${tableName} WHERE ${innerWhereCond} GROUP BY 1)`
//           :  `(SELECT pr_mem_id, sum(gno_view_cnt) AS gno_view_cnt, sum(apply_cnt) AS apply_cnt, sum(scrap_cnt) AS scrap_cnt FROM ${tableName} GROUP BY 1)`
//         whereCond = queryStringList.filter((queryString) => !queryString.startsWith("dt")).join(" AND ")
//       }

//       // 2. 일반 테이블
//       else {
//         fromTable = tableName
//         whereCond = queryStringList.join(" AND ")
//       }
//       let andQuery = `SELECT pr_mem_id${sep}FROM ${fromTable}`

//       if (!_.isEmpty(whereCond)) {
//         andQuery = andQuery.concat(`${sep}WHERE ${whereCond}`)
//       }

//       andQueryList.push(andQuery)
//     }

//     const orQuery = andQueryList.join("\n\nUNION ALL\n\n") // OR == UNION ALL

//     if (orQuery) { eachTableQueryList.push(orQuery) }
//   }

//   // 각 테이블을 SELECT 또는 JOIN 하기 위한 함수
//   const aggregateQuery = (query: string, index: number) => {
//     const startAlias = index2char(0)
//     const currentAlias = index2char(index)

//     return index == 0
//       ? `SELECT DISTINCT ${currentAlias}.pr_mem_id${sep}FROM (${sep}${query}${sep}) AS ${currentAlias}`
//       : `${sep}JOIN (${sep}${query}${sep}) AS ${currentAlias}${sep}ON ${startAlias}.pr_mem_id = ${currentAlias}.pr_mem_id${sep}`
//   }

//   // 데이터 쿼리
//   const dataQuery = eachTableQueryList.map(aggregateQuery).join(sep)

//   return `SELECT ${output_col} FROM (${sep}${dataQuery}${sep}) AS SOURCE_TABLE`
// }
