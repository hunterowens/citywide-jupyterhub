FROM jupyter/datascience-notebook

# Having a CLI text editor is nice.
USER root
RUN apt-get update && apt-get install -y vim graphviz openssh-client
USER $NB_UID

# Install conda dependencies early, as it takes a long time.
RUN conda install -c conda-forge \
  cartopy \
  dask \
  distributed \
  ibis-framework \
  intake \
  intake-parquet \
  matplotlib \
  nodejs \
  numpy \
  opencv \
  scikit-learn \
  scipy \
  tensorflow \
  xlrd \
  statsmodels \
  geopandas \
  s3fs


# Rebuilding lab also takes a long time.
RUN pip install jupyterlab==1.0.0a8
RUN jupyter labextension install --no-build cityofla-labextension
# RUN jupyter labextension install --no-build @jupyterlab/geojson-extension@0.18
# RUN jupyter labextension install --no-build @jupyterlab/toc@1.0.0-pre.2
RUN jupyter labextension uninstall --no-build @jupyterlab/hub-extension
RUN jupyter labextension uninstall --no-build jupyterlab_bokeh
RUN jupyter lab build && jupyter lab clean

# These are pretty quick and are python-only, so pip should be okay.
RUN pip install \
  altair \
  descartes \
  folium \
  geoalchemy2 \
  geocoder \
  geopy \
  intake_geopandas>=0.2.2 \
  intake_dcat>=0.2 \
  ipywidgets \
  ipyleaflet \
  mapboxgl \
  openpyxl \
  papermill \
  psycopg2 \
  usaddress \
  vega-datasets

# AWS CLI is kind of a pain, as it has some old, hard dependencies.
run pip install awscli --ignore-installed


# Environment related
RUN conda init bash
RUN echo "source /etc/bash_completion.d/git-prompt" >> /home/jovyan/.bashrc
ENV GIT_PS1_SHOWDIRTYSTATE=1
ENV PS1='\[\033[01;32m\]\u\[\033[01;34m\] \w\[\e[31m\]$(__git_ps1)\[\033[01;34m\] \$\[\033[00m\] '
