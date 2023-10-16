# RUN conda config --set ssl_verify False && \
#     conda install -y -c conda-forge \
#     streamlit=1.26.0 \
#     plotly=5.17.0 \
#     pyathena=2.14.0 \
#     matplotlib=3.7.2 \
#     pymongo=4.5.0

ARG BUILD_ENV
ARG APP_ROOT=/app

# ENV STAGE
FROM continuumio/miniconda3:4.10.3 as env_stage
ARG APP_ROOT
WORKDIR ${APP_ROOT}
RUN pip install \
    streamlit==1.26.0 \
    plotly==5.17.0 \
    pyathena==2.14.0 \
    matplotlib==3.7.2 \
    pymongo==4.5.0

# SOURCE STAGE: dev
FROM env_stage as dev
# Use volume, instead of copy source code

FROM env_stage as prod
COPY . .

# RUN STAGE
FROM ${BUILD_ENV}
CMD streamlit run cdp_controller.py \
    --server.allowRunOnSave True \
    --logger.enableRich True
