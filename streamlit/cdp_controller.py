import logging, datetime
import streamlit as st
from pymongo.mongo_client import MongoClient
from bson.objectid import ObjectId
from cdp_data import execute_query
from cdp_graph import first_graph, second_graph, third_graph, fourth_graph, fifth_graph, sixth_graph

logger = logging.getLogger("streamlit")
logger.setLevel(logging.INFO)
# logger.addHandler(logging.StreamHandler())
# logger.addHandler(logging.handlers.TimedRotatingFileHandler(
#     filename='./log.txt',
#     when="M",
#     backupCount=4,
#     atTime=datetime.time(0, 0, 0)
# ))

base_query = '''
    with bt as (
    select pr_mem_id, total_career_year, current_pay, edu_level, major, full_data_yn, m_want_job_stat, transfer_cnt, transfer_ratio 
    from jk_dev_cdp_poc_db.cdp_base_table_ik_0830
    ),

    wt as (
    select pr_mem_id, ordno, jobtype_name_c, biztype_name_c, workingmonths
    from jk_dev_cdp_poc_db.cdp_working_table_ik_0830
    ),

    at as (
    select pr_mem_id, sum(gno_view_cnt) as view_cnt, sum(apply_cnt) as apply_cnt, sum(scrap_cnt) as scrap_cnt
    from jk_dev_cdp_poc_db.cdp_activity_table_ik_0830
    group by 1
    )
    
    select *
    from bt as a
    left join wt using(pr_mem_id)
    left join at using(pr_mem_id)
    where pr_mem_id in ( {mem_query} )
    '''

MONGO_DB_NAME = "cdpDB"
MONGO_COLLECTION_NAME = "queries"

client = MongoClient(
    host="mongo",
    port=27017,
    username="admin",
    password="admin",
    document_class=dict,
    tz_aware=False
)

def main():
    params = st.experimental_get_query_params()

    if "query_id" in params.keys():
        query_id = params.get("query_id")[0]

        db = client.get_database(MONGO_DB_NAME)
        collection = db.get_collection(MONGO_COLLECTION_NAME)
        document = collection.find_one({"_id": ObjectId(query_id)})
        mem_query = document["query"]

        logger.info(f"mem_query: {mem_query}")

        query = base_query.format(mem_query=mem_query)

        #st.title('CDP -- 고객 세그 현황 --')
        data = execute_query(query)
        first_graph(data)
        second_graph(data)
        third_graph(data)
        fourth_graph(data)
        fifth_graph(data)
        sixth_graph(data)

    else:
        st.write("`query_id` 가 없습니다")
        st.write(f"`params`: {params}")


if __name__ == '__main__':
    main()
