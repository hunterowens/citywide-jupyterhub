FROM jupyter/datascience-notebook:7a3e968dd212

USER root
# Having a CLI text editor is nice.
RUN apt-get update && apt-get install -y vim graphviz openssh-client gdebi-core bash-completion libaio1

# Rstudio integration
RUN apt-get update && \
    curl --silent -L --fail https://download2.rstudio.org/rstudio-server-1.1.419-amd64.deb > /tmp/rstudio.deb && \
    echo '24cd11f0405d8372b4168fc9956e0386 /tmp/rstudio.deb' | md5sum -c - && \
    apt-get install -y /tmp/rstudio.deb && \
    rm /tmp/rstudio.deb && \
    apt-get clean
ENV PATH=$PATH:/usr/lib/rstudio-server/bin
USER $NB_UID

# PgAdmin
RUN pip install https://ftp.postgresql.org/pub/pgadmin/pgadmin4/v4.12/pip/pgadmin4-4.12-py2.py3-none-any.whl
RUN pip install gunicorn
COPY pgadmin_config.py ${CONDA_DIR}/lib/python3.7/site-packages/pgadmin4/config_local.py
COPY setup_pgadmin.sh /setup_pgadmin.sh
RUN /setup_pgadmin.sh

# Install conda dependencies early, as it takes a long time.
RUN conda install -c conda-forge \
  cartopy \
  "dask>=2.8" \
  distributed \
  "gdal=2.4.1" \
  geopandas \
  intake \
  intake-parquet \
  matplotlib \
  nltk \
  nodejs \
  numpy \
  opencv \
  osmnx \
  "pandas>=0.25" \
  pymc3 \
  python-graphviz \
  r-catools \
  r-devtools \
  r-leaflet \
  r-rgdal \
  r-rpostgres \
  r-rjdbc \
  r-rmysql \
  r-rpostgres \
  r-shinydashboard \
  r-tidytext \
  r-units \
  r-usethis \
  s3fs \
  scikit-learn \
  scipy \
  spacy \
  statsmodels \
  tensorflow \
  xlrd

# R shiny-server needs to be installed after the R package
USER root
RUN wget https://download3.rstudio.org/ubuntu-14.04/x86_64/shiny-server-1.5.9.923-amd64.deb -O /tmp/shiny.deb
RUN gdebi -n /tmp/shiny.deb && fix-permissions /var/log/shiny-server /var/lib/shiny-server
RUN rm /tmp/shiny.deb
USER $NB_UID

# Install Oracle Instant Client drivers.
USER root
RUN wget https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basic-linux.x64-19.6.0.0.0dbru.zip -O instant_client.zip
RUN unzip instant_client.zip && mkdir -p /opt/oracle && mv instantclient_19_6 /opt/oracle/
RUN echo /opt/oracle/instantclient_19_6 > /etc/ld.so.conf.d/oracle-instantclient.conf && ldconfig
RUN rm instant_client.zip
USER $NB_UID

# Install some stuff from CRAN + Github that is not available on conda-forge.
# env tar for r urbanmapper / github install r packages
ENV TAR="/bin/tar"
RUN R -e "install.packages(c('tidycensus'), dependencies=TRUE, repos = 'http://cran.us.r-project.org')"
RUN R -e "devtools::install_github('UrbanInstitute/urbnmapr')"

# AWS CLI is a pain, as it pins an old version of pyyaml
RUN pip install awscli --ignore-installed

# Rebuilding lab also takes a long time.
RUN pip install jupyterlab==1.2.6
RUN jupyter labextension install --no-build @jupyter-voila/jupyterlab-preview@0.1.3
RUN jupyter labextension install --no-build @jupyter-widgets/jupyterlab-manager@1.0
RUN jupyter labextension install --no-build @jupyterlab/geojson-extension@1.0
RUN jupyter labextension install --no-build @jupyterlab/git@0.7
RUN jupyter labextension install --no-build @jupyterlab/github@1.0.1
RUN jupyter labextension install --no-build @jupyterlab/toc@1.0
RUN jupyter labextension install --no-build bqplot
RUN jupyter labextension install --no-build arcgis-map-ipywidget@1.7.0
RUN jupyter labextension install --no-build cityofla-labextension@0.5.0
RUN jupyter labextension install --no-build dask-labextension@1.0
RUN jupyter labextension install --no-build jupyter-leaflet@0.11.7
RUN jupyter labextension install --no-build jupyterlab-plotly@1.5.2
RUN jupyter labextension install --no-build jupyterlab-dash@0.1.0-alpha.3
RUN jupyter labextension install --no-build jupyterlab-spreadsheet@0.2
RUN jupyter labextension install --no-build nbdime-jupyterlab@1.0
RUN jupyter labextension install --no-build plotlywidget@1.5.2

# jupyterlab-sql installs a labextension behind the scenes.
RUN pip install \
  dask_labextension>=1.0 \
  jupyter-rsession-proxy \
  jupyterlab-dash==0.1.0a3 \
  jupyterlab_git>=0.6.1 \
  jupyterlab_github>=1.0 \
  jupyterlab_sql>=0.3 \
  nbdime \
  voila==0.1.20

# Enable the serverextensions that do not use the conf.d approach
RUN jupyter serverextension enable --sys-prefix jupyterlab_sql
RUN jupyter serverextension enable --sys-prefix jupyterlab_git

# Build JupyterLab.
RUN jupyter lab build --dev-build=False --debug && jupyter lab clean

# Install some python-only packages using pip
RUN pip install \
  altair \
  arcgis==1.7.0 \
  black \
  bqplot \
  census-data-downloader \
  CensusData \
  contextily==1.0rc2 \
  cookiecutter \ 
  cx_Oracle \
  descartes \
  flake8 \
  folium \
  geoalchemy2 \
  geocoder \
  geopy \
  ibis-framework==1.3 \
  intake_geopandas==0.2.3 \
  intake_dcat>=0.4.0 \
  git+https://github.com/intake/intake-sql.git@7709beb#egg=intake_sql \
  ipyleaflet==0.11.7 \
  ipywidgets==7.5.1 \
  isort \
  kmodes \
  mapboxgl \
  markov_clustering \
  mypy \
  openpyxl \
  papermill \
  partridge \
  plotly>=4.0 \
  plotly-geo>=1.0 \
  polyline \
  psycopg2 \
  selenium \
  sodapy \
  usaddress \
  vega-datasets \
  xlsxwriter

# Jupyter/IPython config
USER root
RUN mkdir -p /etc/ipython
COPY ipython_config.py /etc/ipython/
COPY jupyter_notebook_config.py ${CONDA_DIR}/etc/jupyter/
USER $NB_UID

# Environment-related
USER root
COPY custom.sh /tmp/custom.sh
RUN cat /tmp/custom.sh >> /etc/bash.bashrc
USER $NB_UID

# Use bash login shell for entrypoint in order
# to automatically source user's .bash_profile
CMD ["bash", "-l", "-c", "'start-notebook.sh'"]
