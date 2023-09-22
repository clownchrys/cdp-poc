import streamlit as st
import matplotlib.pyplot as plt
from plotly.subplots import make_subplots
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
import plotly.io as pio
pio.renderers.default = 'notebook'
plt.rcParams['font.family'] = 'Batang'
plt.rcParams['axes.unicode_minus'] = False


@st.cache_data
def convert_df(df):
    return df.to_csv().encode('CP949')





def first_graph(df):
    df.drop_duplicates(subset = ['pr_mem_id'], inplace = True)
    c_year_stat = df['c_year_group'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    c_year_stat['pct'] = round(c_year_stat['pct'] * 100, 2)
    pay_df = df[(df['current_pay']>=2200) & (df['current_pay'] <=100000)]
    pay_stat = pay_df['current_pay_group'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    pay_stat['pct'] = round(pay_stat['pct'] * 100, 2)
    st.subheader('CDP 데모 정보', divider= 'rainbow')
    if st.checkbox('경력 & 연봉 Raw 데이터 보기'):
        #st.subheader('경력 & 연봉')
        col1, col2 = st.columns(2)
        with col1:
            st.dataframe(c_year_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(c_year_stat),
            "career.csv",
             key='first-csv'
                )
        with col2:
            st.dataframe(pay_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(pay_stat),
            "paygrade.csv",
             key='second-csv'
                )
    
    if c_year_stat.shape[0] ==0 or pay_stat.shape[0] ==0:
        st.write('해당 조건의 데이터가 부족합니다. 조건 수정 필요')
    else:
        fig = make_subplots(rows=1, cols =2, specs = [[{'type': "pie" },  {'type': "pie" } ]], subplot_titles=(  f"경력별 현황", f"연봉별 현황") )
        fig.add_trace(go.Pie(labels = c_year_stat.c_year_group, values = c_year_stat.pct ), row=1, col =1)
        fig.add_trace(go.Pie(labels = pay_stat.current_pay_group, values = pay_stat.pct ), row=1, col =2)
        fig.update_traces(marker_colors =px.colors.sequential.RdBu , marker_line_color= "white",marker_line_width = 2,
                  textposition = 'inside', textinfo = 'label+value', textfont_size = 12, textfont_color = 'white')
        fig.update_traces(pull=[0.1, 0, 0, 0, 0,0, 0,0, 0, 0], showlegend=False)
    
        st.plotly_chart(fig,  use_container_width=True)


def second_graph(df):
    #school
    df.drop_duplicates(subset = ['pr_mem_id'], inplace = True)
    edu_stat = df['edu_level'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    edu_stat['pct'] = round(edu_stat['pct'] * 100, 2)
    edu_stat = edu_stat[:10]

    # major
    major_stat = df['major'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    major_stat['pct'] = round(major_stat['pct'] * 100, 2)
    major_stat = major_stat[:10]
    
    if st.checkbox('학력 & 전공 Raw 데이터 보기'):
        #st.subheader('학력 & 전공')
        col1, col2 = st.columns(2)
        with col1:
            st.dataframe(edu_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(edu_stat),
            "edu.csv",
             key='third-csv'
                )
        with col2:
            st.dataframe(major_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(major_stat),
            "major.csv",
             key='fourth-csv'
                )
    if edu_stat.shape[0] ==0 or major_stat.shape[0] ==0:
        st.write('해당 조건의 데이터가 부족합니다. 조건 수정 필요')
    else:
        fig = make_subplots(rows=1, cols =2, specs = [[{'type': "pie" },  {'type': "pie" } ]], subplot_titles=(  f"학력별 Top10", f"전공별 Top10") )
        fig.add_trace(go.Pie(labels = edu_stat.edu_level, values = edu_stat.pct ), row=1, col =1)
        fig.add_trace(go.Pie(labels = major_stat.major, values = major_stat.pct ), row=1, col =2)
        fig.update_traces(marker_colors =px.colors.sequential.RdBu , marker_line_color= "white",marker_line_width = 2,
                  textposition = 'inside', textinfo = 'label+value', textfont_size = 12, textfont_color = 'white')               
        fig.update_traces(pull=[0.1, 0, 0, 0, 0,0, 0,0, 0, 0], showlegend = False)
        st.plotly_chart(fig,  use_container_width=True)

   
def third_graph(df):
    #풀데이터 입력여부
    df.drop_duplicates(subset = ['pr_mem_id'], inplace = True)
    full_stat =  df['full_data_yn'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    full_stat['pct'] = round(full_stat['pct'] * 100, 2)

    #이력서 공개여부
    want_stat = df['m_want_job_stat'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    want_stat['pct'] = round(want_stat['pct'] * 100, 2)
    if st.checkbox('풀데이터 & 이력서공개여부 Raw 데이터 보기'):
        #st.subheader('풀데이터 & 이력서공개여부')
        col1, col2 = st.columns(2)
        with col1:
            st.dataframe(full_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(full_stat),
            "full_stat.csv",
             key='fifth-csv'
                )
        with col2:
            st.dataframe(want_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(want_stat),
            "want_stat.csv",
             key='sixth-csv'
                )
    if full_stat.shape[0] ==0 or want_stat.shape[0] ==0:
        st.write('해당 조건의 데이터가 부족합니다. 조건 수정 필요')
    else:
        fig = make_subplots(rows=1, cols =2, specs = [[{'type': "pie" },  {'type': "pie" } ]], subplot_titles=(  f"풀데이터입력 현황", f"이력서공개 현황") )
        fig.add_trace(go.Pie(labels = full_stat.full_data_yn, values = full_stat.pct ), row=1, col =1)
        fig.add_trace(go.Pie(labels = want_stat.m_want_job_stat, values = want_stat.pct ), row=1, col =2)
        fig.update_traces(marker_colors =px.colors.sequential.RdBu , marker_line_color= "white",marker_line_width = 2,
                  textposition = 'inside', textinfo = 'label+value', textfont_size = 12, textfont_color = 'white')
        fig.update_traces(pull=[0.1, 0, 0, 0, 0,0, 0,0, 0, 0], showlegend = False)
        st.plotly_chart(fig,  use_container_width=True)

def fourth_graph(df):
    #직무별
    jobtype_stat = df['jobtype_name_c'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    jobtype_stat['pct'] = round(jobtype_stat['pct'] * 100, 2)
    jobtype_stat = jobtype_stat[:10]

    #산업별 
    biztype_stat = df['biztype_name_c'].value_counts(normalize= True).reset_index().rename(columns={ 'proportion': 'pct' })
    biztype_stat['pct'] = round(biztype_stat['pct'] * 100, 2)
    biztype_stat = biztype_stat[:10]

    st.subheader('CDP 커리어 정보', divider= 'rainbow')
    if st.checkbox('직무 & 산업별 Raw 데이터 보기'):
        #st.subheader('직무 & 산업')
        col1, col2 = st.columns(2)
        with col1:
            st.dataframe(jobtype_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(jobtype_stat),
            "jobtype.csv",
             key='seventh-csv'
                )
        with col2:
            st.dataframe(biztype_stat, height=300, width=300)
            st.download_button(
            "엑셀로 다운받기",
            convert_df(biztype_stat),
            "biztype.csv",
             key='eigth-csv'
                )
    if jobtype_stat.shape[0] ==0 or biztype_stat.shape[0] ==0:
        st.write('해당 조건의 데이터가 부족합니다. 조건 수정 필요')
    else:
        col1, col2 = st.columns(2)
        with col1:
            parents1 = ['all' for x in   range(jobtype_stat.jobtype_name_c.nunique())]
            fig1 = go.Figure(go.Treemap(
            labels = jobtype_stat.jobtype_name_c,
            values = jobtype_stat.pct,
            parents= parents1,
            marker_colorscale = 'Blues'
            ) )
            fig1.update_layout(margin = dict(t=50, l=25, r=25, b=25),  title="직무별 Top 10")
            st.plotly_chart(fig1,  use_container_width=True)

        with col2:
            
            parents2 = ['all' for x in   range(biztype_stat.biztype_name_c.nunique())]
            fig2 = go.Figure(go.Treemap(
            labels = biztype_stat.biztype_name_c,
            values = biztype_stat.pct,
            parents= parents2,
            marker_colorscale = 'Blues'
            ) )
            fig2.update_layout(margin = dict(t=50, l=25, r=25, b=25),  title="산업별 Top 10")
            st.plotly_chart(fig2,  use_container_width=True)



def fifth_graph(df):
    df.drop_duplicates(subset = ['pr_mem_id'], inplace = True)
    transfer_stat = df['transfer_cnt'].describe(percentiles=np.arange(0.1, 1, 0.2)).reset_index().rename(columns={ 'index': '통계량', 'transfer_cnt': '이직수' })[1:]
    ratio_stat = df['transfer_ratio'].describe(percentiles=np.arange(0.1, 1, 0.2)).reset_index().rename(columns={ 'index': '통계량', 'transfer_ratio': '이직율(총경력/이직수)' })[1:]
    #st.subheader('이직수 & 이직율 백분율')
    if transfer_stat.shape[0] ==0 or ratio_stat.shape[0] ==0:
        st.write('해당 조건의 데이터가 부족합니다. 조건 수정 필요')
    else:    
        col1, col2 = st.columns(2)
        with col1:
            st.write('이직수 백분율')
            st.dataframe(transfer_stat, width=400, height=400)
        with col2:
            st.write('이직율 백분율')
            st.dataframe(ratio_stat, width = 400, height = 400)


def sixth_graph(df):
    df.drop_duplicates(subset = ['pr_mem_id'], inplace = True)
    view_stat = df['view_cnt'].describe(percentiles=np.arange(0.1, 1, 0.2)).reset_index().rename(columns={ 'index': '통계량', 'view_cnt': '공고조회수' })[1:]
    apply_stat = df['apply_cnt'].describe(percentiles=np.arange(0.1, 1, 0.2)).reset_index().rename(columns={ 'index': '통계량', 'apply_cnt': '지원수' })[1:]
    st.subheader('CDP 행동 정보', divider= 'rainbow')
    if view_stat.shape[0] ==0 or apply_stat.shape[0] ==0:
        st.write('해당 조건의 데이터가 부족합니다. 조건 수정 필요')
    else:    
        col1, col2 = st.columns(2)
        with col1:
            st.dataframe(view_stat, width=400, height=400)
        with col2:
            st.dataframe(apply_stat, width = 400, height = 400)