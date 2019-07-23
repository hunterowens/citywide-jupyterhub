FROM jupyter/datascience-notebook:7a3e968dd212

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
  r-rgdal \
  r-units \
  scikit-learn \
  scipy \
  tensorflow \
  xlrd \
  statsmodels \
  geopandas \
  s3fs

# Install some stuff from CRAN that is not available on conda-forge.
RUN R -e "install.packages('tidycensus', dependencies=TRUE, repos = 'http://cran.us.r-project.org')"

# AWS CLI is a pain, as it pins an old version of pyyaml
RUN pip install awscli --ignore-installed

# Rebuilding lab also takes a long time.
RUN pip install -U jupyterlab
RUN jupyter labextension install --no-build cityofla-labextension@0.4.2
RUN jupyter labextension install --no-build @jupyter-widgets/jupyterlab-manager@1.0
RUN jupyter labextension install --no-build @jupyterlab/geojson-extension@1.0
RUN jupyter labextension install --no-build @jupyterlab/github@1.0
RUN jupyter labextension install --no-build @jupyterlab/toc@1.0
RUN jupyter labextension install --no-build dask-labextension@1.0
RUN jupyter labextension install --no-build jupyter-leaflet@0.11
RUN jupyter labextension install --no-build plotlywidget@1.0
RUN jupyter labextension install --no-build jupyterlab-plotly@1.0
RUN jupyter labextension install --no-build jupyterlab-dash@0.1.0-alpha.3
RUN jupyter labextension install --no-build jupyterlab-spreadsheet@0.1

# jupyterlab-sql installs a labextension behind the scenes.
RUN pip install \
  dask_labextension>=1.0 \
  jupyter-rsession-proxy \
  jupyterlab-dash==0.1.0a3 \
  jupyterlab_github>=1.0 \
  jupyterlab_sql>=0.3

# Enable the serverextensions that do not use the conf.d approach
RUN jupyter serverextension enable jupyterlab_sql

# Build JupyterLab.
RUN jupyter lab build --dev-build=False && jupyter lab clean

# Install some python-only packages using pip
RUN pip install \
  altair \
  descartes \
  folium \
  geoalchemy2 \
  geocoder \
  geopy \
  intake_geopandas>=0.2.2 \
  intake_dcat>=0.2.3 \
  ipyleaflet \
  mapboxgl \
  openpyxl \
  papermill \
  plotly>=4.0 \
  plotly-geo>=1.0 \
  psycopg2 \
  usaddress \
  vega-datasets

# Environment-related
USER root
COPY custom.sh /tmp/custom.sh
RUN cat /tmp/custom.sh >> /etc/bash.bashrc
USER $NB_UID
