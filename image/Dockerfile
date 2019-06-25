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
RUN pip install jupyterlab==1.0.0rc0
RUN jupyter labextension install --no-build cityofla-labextension@0.3.0
RUN jupyter labextension install --no-build @jupyterlab/github@1.0.0-rc.0
RUN jupyter labextension install --no-build @jupyterlab/geojson-extension@0.18.1
RUN jupyter labextension install --no-build @jupyterlab/toc@1.0.0-rc.0
# RUN jupyter labextension uninstall --no-build @jupyterlab/hub-extension
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
  jupyterlab_github \
  mapboxgl \
  openpyxl \
  papermill \
  psycopg2 \
  usaddress \
  vega-datasets \
  jupyter-rsession-proxy

# AWS CLI is kind of a pain, as it has some old, hard dependencies.
RUN pip install awscli --ignore-installed


# Rstudio integration 

# install rstudio-server
USER root
RUN apt-get update && \
    curl --silent -L --fail https://download2.rstudio.org/rstudio-server-1.1.419-amd64.deb > /tmp/rstudio.deb && \
    echo '24cd11f0405d8372b4168fc9956e0386 /tmp/rstudio.deb' | md5sum -c - && \
    apt-get install -y /tmp/rstudio.deb && \
    rm /tmp/rstudio.deb && \
    apt-get clean
ENV PATH=$PATH:/usr/lib/rstudio-server/bin
USER $NB_USER

# Environment related
USER root
COPY custom.sh /tmp/custom.sh
RUN cat /tmp/custom.sh >> /etc/bash.bashrc
USER $NB_UID
