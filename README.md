# Citywide Data Science JupyterHub

This repository contains Docker images and Kubernetes configuration
for the Citywide Data Science and Predictive Analytics JupyterHub deployment.

The Docker image can be found in [`image`](./image).
It can be build using `make build`, and published to Dockerhub using `make publish`.

The Kubernetes configuration can be found in [`deploy`](./deploy).
It is based on the [Zero-to-JupyterHub](https://zero-to-jupyterhub.readthedocs.io/en/latest/) guide.
It can be deployed using `make upgrade`.
