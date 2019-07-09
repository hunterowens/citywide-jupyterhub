# Citywide Data Science JupyterHub

This repository contains Docker images and Kubernetes configuration
for the Citywide Data Science and Predictive Analytics JupyterHub deployment.

The Docker image can be found in [`image`](./image).
It can be build using `make build`, and published to Dockerhub using `make publish`.

The Kubernetes configuration can be found in [`deploy`](./deploy).
It is based on the [Zero-to-JupyterHub](https://zero-to-jupyterhub.readthedocs.io/en/latest/) guide.
It can be deployed using `make upgrade`.

## Setup

* To setup on WSL, you'll need the `deploy/secrets.yaml` file and the `~/.kube/config`. 

* Install kubectl using `conda install -c conda-forge kubernetes` 

* You'll need to also be running the latest version of AWS CLI, or at least > 1.16. 

* Then, create a profile for Kubernets inside your `~/.aws/credentials`

* You'll need to set the profile key in the kubectl config under `user:exec:` as 

```
env:
        # - name: AWS_PROFILE
        #   value: "<aws-profile>"

```

* For the secrets file, we use git crypt. Make sure you have the `citywide-jhub.key` file and then run `git-crypt unlock ~/path/to/key` in the base of the repo. 

* From there, you should be able to run something like `kubectl get svc`. 

* Finally, you'll need Helm, the package manager for Kubernetes. To install helm, follow the steps from [Zero to JupyterHub](https://zero-to-jupyterhub.readthedocs.io/en/latest/setup-helm.html). 
