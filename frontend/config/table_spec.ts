import type { SourceTable, TableAttributeSpec } from "@/types/table";
import DateRange from "@/components/condition_nodes/date_range";
import NumberCompare from "@/components/condition_nodes/num_compare";
import NumberRange from "@/components/condition_nodes/num_range";
import ValuesIn from "@/components/condition_nodes/values_in";
import StringCompare from "@/components/condition_nodes/str_compare";
import StringRange from "@/components/condition_nodes/str_range";

export const JK_CDP_TABLE_NAME_MAPPER: {[keys in SourceTable]: string} = {
    "jk_dev_cdp_poc_db.cdp_base_table_ik_0830": "기본 정보",
    "jk_dev_cdp_poc_db.cdp_activity_table_ik_0830": "활동 정보",
    "jk_dev_cdp_poc_db.cdp_working_table_ik_0830": "근무 정보",
    "jk_dev_cdp_poc_db.cdp_marketing_table_ik_0830": "마케팅 동의 정보"
}

export const JK_CDP_TABLE_SPEC: TableAttributeSpec = {
    "jk_dev_cdp_poc_db.cdp_base_table_ik_0830": [
        {
            label: "경력(연)",
            value: "total_career_year",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
        {
            label: "현 직장 연봉(만 단위)",
            value: "current_pay",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
        {
            label: "최종 학력",
            value: "edu_level",
            children: [
                ValuesIn.getMeta({options: [
                    "대학재학중",
                    "고등학교 재학중",
                    "초대졸업",
                    "대학졸업",
                    "대학중퇴",
                    "초등학교 졸업",
                    "고등학교졸업",
                    "대학원졸예정",
                    "초대중퇴",
                    "대학원수료",
                    "초대재학중",
                    "초대졸예정",
                    "중학교졸업",
                    "대학원중퇴",
                    "대학원졸업",
                    "미확인",
                    "고등학교 졸업예정",
                    "대학원재학중",
                    "대학졸업예정",
                ]}),
            ]
        },
        {
            label: "주소지(구)",
            value: "local_name",
            children: [
                StringCompare.getMeta(),
            ]
        },
        {
            label: "fulldata 유무",
            value: "full_data_yn",
            children: [
                ValuesIn.getMeta({options: [0, 1]}),
            ]
        },
        {
            label: "이력서 공개여부",
            value: "m_want_job_stat",
            children: [
                StringCompare.getMeta(),
            ]
        },
        {
            label: "최근 이력서 update일자",
            value: "resume_edit_dt",
            children: [
                DateRange.getMeta(),
            ]
        },
        {
            label: "최근 접속 일자",
            value: "last_conn_dt",
            children: [
                DateRange.getMeta(),
            ]
        },
        {
            label: "현직장 근무일(월)",
            value: "c_working_months",
            children: [
                NumberCompare.getMeta(),
            ]
        },
        {
            label: "희망연봉",
            value: "m_want_pay",
            children: [
                NumberCompare.getMeta(),
            ]
        },
        // {
        //     label: "하드스킬",
        //     value: "jk_hardskill_name",
        //     children: [
        //         StringCompare.getMeta(),
        //     ]
        // },
        {
            label: "총 이직수",
            value: "transfer_cnt",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
        {
            label: "평균 이직시간 간격",
            value: "transfer_ratio",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
    ],

    "jk_dev_cdp_poc_db.cdp_activity_table_ik_0830": [
        {
            label: "일별 날짜",
            value: "dt",
            children: [
                StringCompare.getMeta(),
                StringRange.getMeta(),
            ]
        },
        {
            label: "일별 공고조회수",
            value: "gno_view_cnt",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
        {
            label: "일별 지원수",
            value: "apply_cnt",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
        {
            label: "일별 스크랩수",
            value: "scrap_cnt",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
    ],

    "jk_dev_cdp_poc_db.cdp_working_table_ik_0830": [
        {
            label: "경력최근순서",
            value: "ordno",
            children: [
                NumberCompare.getMeta(),
                NumberRange.getMeta(),
            ]
        },
        {
            label: "회사명",
            value: "c_name",
            children: [
                StringCompare.getMeta(),
            ]
        },
        {
            label: "근무시작 년월",
            value: "csym",
            children: [
                StringCompare.getMeta(),
                StringRange.getMeta(),
            ]
        },
        {
            label: "근무종료 년월",
            value: "ceym",
            children: [
                StringRange.getMeta(),
            ]
        },
        {
            label: "근무회사 산업",
            value: "biztype_name_c",
            children: [
                StringCompare.getMeta(),
            ]
        },
        {
            label: "근무회사 직무",
            value: "jobtype_name_c",
            children: [
                StringCompare.getMeta(),
            ]
        },
        {
            label: "근무회사 주소",
            value: "c_area_no",
            children: [
                StringCompare.getMeta(),
            ]
        },
        {
            label: "근무회사 상장상태",
            value: "c_listed_company",
            children: [
                ValuesIn.getMeta({
                    options: [
                        "미확인",
                        "유가증권 상장",
                        "코스닥 상장",
                        "비상장",
                        "해외상장",
                        "코넥스 상장",
                        "해외상정법인 자회사",
                    ]
                }),
            ]
        },
        {
            label: "근무회사 기업형태",
            value: "c_type",
            children: [
                ValuesIn.getMeta({
                    options: [
                        "대기업",
                        "벤처기업",
                        "중소기업 (300이하)",
                        "국내공공기관공기업",
                        "외국계(외국법인)",
                        "외국계(외국투자기업)",
                        "국내비영리단체협회",
                        "대기업 자회사",
                        "중견기업 (300이상)",
                        "외국기관비영리단체",
                        "미확인",
                    ]
                }),
            ]
        },
        {
            label: "근무기간(월)",
            value: "workingmonths",
            children: [
                NumberCompare.getMeta(),
            ]
        },
    ],

    "jk_dev_cdp_poc_db.cdp_marketing_table_ik_0830": [
        {
            label: "이메일 공개여부",
            value: "email_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "개인문자수신여부",
            value: "m_sms_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "대기업공고 메일 수신여부",
            value: "major_c_gi_mail",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "Push 알림 동의여부",
            value: "push_agree_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "추천채용정보 알림여부",
            value: "recom_empinfo_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "관심기업신규공고 알림여부",
            value: "c_interest_new_gi_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "입사지원현황 알림여부",
            value: "apply_status_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "스크랩공고 알림여부",
            value: "scrap_gi_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "공지이벤트 알림여부",
            value: "ann_event_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "인사담당자 이메일 알림통 발송여부",
            value: "hr_event_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "지원공고 마감 1일전 알림여부",
            value: "apply_gi_end_oneday_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "실시간 공채소식 알림여부",
            value: "realtime_gi_onfo_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "내 이력서 열람기업 알림여부",
            value: "resume_read_c_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "헤드헌팅 활동 알림여부",
            value: "head_action_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "문의신고답변 알림여부",
            value: "inquery_answer_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "취업톡톡 동문기업 직무질문 알림여부",
            value: "talk_c_jobtype_question_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "취업톡톡 질문의 답변/댓글/북마크의 질문답변 알림여부",
            value: "talk_answer_bookmark_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "취업톡톡 답변의 댓글 알림여부",
            value: "talk_answer_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "지인추천 알림여부",
            value: "recom_acq_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "취업톡톡 구독자소식 알림여부",
            value: "talk_subscribe_info_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "취업톡톡 구독그룹회원의 새글 알림여부",
            value: "talk_subscribe_group_newpost_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        },
        {
            label: "취업톡톡 추천회원 추천글선정 알림여부",
            value: "talk_recom_post_select_stat",
            children: [
                ValuesIn.getMeta({ options: [0, 1] }),
            ]
        }
    ]
}
