FROM jupyter/datascience-notebook

USER root
# Having a CLI text editor is nice.
RUN apt-get update && apt-get install -y vim graphviz openssh-client

# Rstudio integration
RUN apt-get update && \
    curl --silent -L --fail https://download2.rstudio.org/rstudio-server-1.1.419-amd64.deb > /tmp/rstudio.deb && \
    echo '24cd11f0405d8372b4168fc9956e0386 /tmp/rstudio.deb' | md5sum -c - && \
    apt-get install -y /tmp/rstudio.deb && \
    rm /tmp/rstudio.deb && \
    apt-get clean
ENV PATH=$PATH:/usr/lib/rstudio-server/bin
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
RUN pip install -U jupyterlab
RUN jupyter labextension install --no-build cityofla-labextension@0.4.1
RUN jupyter labextension install --no-build @jupyter-widgets/jupyterlab-manager@1.0
RUN jupyter labextension install --no-build @jupyterlab/geojson-extension@1.0
RUN jupyter labextension install --no-build @jupyterlab/toc@1.0
# RUN jupyter labextension uninstall --no-build @jupyterlab/hub-extension
RUN jupyter labextension uninstall --no-build jupyterlab_bokeh
RUN jupyter lab build --dev-build=False && jupyter lab clean

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
  vega-datasets \
  jupyter-rsession-proxy

# AWS CLI is kind of a pain, as it has some old, hard dependencies.
RUN pip install awscli --ignore-installed

# Environment related
USER root
COPY custom.sh /tmp/custom.sh
RUN cat /tmp/custom.sh >> /etc/bash.bashrc
USER $NB_UID
