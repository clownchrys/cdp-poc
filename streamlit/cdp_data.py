
import streamlit as st
from pyathena.pandas.util import as_pandas
from pyathena import connect

ACCESS_KEY = "AKIAVTQ6NX2DXNCKSX65"
SECRET_KEY = "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"
cursor = connect(aws_access_key_id=ACCESS_KEY,

                aws_secret_access_key=SECRET_KEY,

                s3_staging_dir='s3://jk-jobia-dev-s3-athena/analyze-temp-query-result/',

                region_name='ap-northeast-2').cursor()



# 경력
def convert_c_yrs(yrs):
    if yrs <1:
        return '1년미만'
    elif yrs >=1 and yrs <3:
        return '1~3년미만'
    elif yrs >=3 and yrs <6:
        return '3~6년미만'
    elif yrs >=6 and yrs <9:
        return '6~9년미만'
    elif yrs >=9 and yrs <12:
        return '9~12년미만'
    else:
        return '12년이상'

def convert_pay(pay):
    if pay >2200 and pay <=3000:
        return '2200~3000만원'
    elif pay >3000 and pay <=4000:
        return '3000~4000만원'
    elif pay >4000 and pay <=6000:
        return '4000~6000만원'
    elif pay >6000 and pay <=8000:
        return '6000~8000만원'
    elif pay > 8000 and pay <= 10000:
        return '8000~1억'
    else:
        return '1억초과'

# need to change
@st.cache_data
def execute_query(query) :
    cursor.execute(query, work_group='analytics-temp')
    dd =  as_pandas(cursor)
    dd['working_year'] = round(dd['workingmonths'] /12, 2)
    dd = dd[dd['total_career_year'] >= dd['working_year']]
    col_to_use = ['pr_mem_id', 'total_career_year', 'current_pay', 'edu_level', 'major', 'full_data_yn', 'm_want_job_stat', 'jobtype_name_c', 'biztype_name_c', 'transfer_cnt', 'transfer_ratio', 'view_cnt', 'apply_cnt']
    dd = dd[col_to_use]
    dd['c_year_group'] =  dd['total_career_year'].apply(convert_c_yrs)
    dd['current_pay'] = dd['current_pay'].fillna(0).astype(int)
    dd['current_pay_group'] = dd['current_pay'].apply(convert_pay)
    dd['full_data_yn'].fillna(0, inplace= True)
    dd['full_data_yn']= dd['full_data_yn'].map({1:'풀데이터완료',  0:'미완료'})
    return dd


'''
if __name__ == '__main__':
    data = execute_query(query_txt)
    print(data.head(2))
'''