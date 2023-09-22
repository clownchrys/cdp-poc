FROM continuumio/miniconda3:4.10.3

WORKDIR /app

RUN conda config --set ssl_verify False \
    && conda install -y -c conda-forge \
    streamlit \
    plotly \
    pyathena \
    matplotlib \
    pymongo

CMD streamlit run cdp_controller.py \
    --server.allowRunOnSave True \
    --logger.enableRich True

# CMD sleep inf