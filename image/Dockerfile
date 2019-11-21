FROM jupyter/datascience-notebook:7a3e968dd212

USER root
# Having a CLI text editor is nice.
RUN apt-get update && apt-get install -y vim graphviz openssh-client gdebi-core bash-completion

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
  dask \
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
  pymc3 \
  python-graphviz \
  r-catools \
  r-leaflet \
  r-rgdal \
  r-rjdbc \
  r-rmysql \
  r-shinydashboard \
  r-tidytext \
  r-units \
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

# Install some stuff from CRAN + Github that is not available on conda-forge.
# env tar for r urbanmapper / github install r packages
ENV TAR="/bin/tar"
RUN R -e "install.packages(c('census', 'tidycensus', 'devtools'), dependencies=TRUE, repos = 'http://cran.us.r-project.org')"
RUN R -e "devtools::install_github('UrbanInstitute/urbnmapr')"

# AWS CLI is a pain, as it pins an old version of pyyaml
RUN pip install awscli --ignore-installed

# Rebuilding lab also takes a long time.
RUN pip install jupyterlab==1.1.3
RUN jupyter labextension install --no-build @jupyter-widgets/jupyterlab-manager@1.0
RUN jupyter labextension install --no-build @jupyterlab/geojson-extension@1.0
RUN jupyter labextension install --no-build @jupyterlab/git@0.7
RUN jupyter labextension install --no-build @jupyterlab/github@1.0.1
RUN jupyter labextension install --no-build @jupyterlab/toc@1.0
RUN jupyter labextension install --no-build arcgis-map-ipywidget@1.6.2-post1
RUN jupyter labextension install --no-build cityofla-labextension@0.5.0
RUN jupyter labextension install --no-build dask-labextension@1.0
RUN jupyter labextension install --no-build jupyter-leaflet@0.11
RUN jupyter labextension install --no-build jupyterlab-plotly@1.0
RUN jupyter labextension install --no-build jupyterlab-dash@0.1.0-alpha.3
RUN jupyter labextension install --no-build jupyterlab-spreadsheet@0.2
RUN jupyter labextension install --no-build nbdime-jupyterlab@1.0
RUN jupyter labextension install --no-build plotlywidget@1.0

# jupyterlab-sql installs a labextension behind the scenes.
RUN pip install \
  dask_labextension>=1.0 \
  jupyter-rsession-proxy \
  jupyterlab-dash==0.1.0a3 \
  jupyterlab_git>=0.6.1 \
  jupyterlab_github>=1.0 \
  jupyterlab_sql>=0.3 \
  nbdime

# Enable the serverextensions that do not use the conf.d approach
RUN jupyter serverextension enable --sys-prefix jupyterlab_sql
RUN jupyter serverextension enable --sys-prefix jupyterlab_git

# Build JupyterLab.
RUN jupyter lab build --dev-build=False && jupyter lab clean

# Install some python-only packages using pip
RUN pip install \
  altair \
  arcgis==1.6.2.post1 \
  census-data-downloader \
  contextily==1.0rc2 \
  cookiecutter \ 
  descartes \
  folium \
  geoalchemy2 \
  geocoder \
  geopy \
  git+https://github.com/ibis-project/ibis.git@2157354 \
  git+https://github.com/intake/intake_geopandas.git@4332e03#egg=intake_geopandas \
  intake_dcat>=0.3.1 \
  git+https://github.com/intake/intake-sql.git@2834e26#egg=intake_sql \
  ipyleaflet \
  mapboxgl \
  openpyxl \
  papermill \
  partridge \
  plotly>=4.0 \
  plotly-geo>=1.0 \
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
# to automatically source user's .bashrc
CMD ["bash", "-l", "-c", "'start-notebook.sh'"]
