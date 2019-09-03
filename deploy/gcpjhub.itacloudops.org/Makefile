.PHONY: upgrade

RELEASE=jhub
CONTEXT="gke_ita-kubernetes-poc_us-west1-b_gcp-cluster"

upgrade:
	kubectl config use-context ${CONTEXT}
	helm upgrade ${RELEASE} jupyterhub/jupyterhub \
					--version=0.8.2 \
					--values ../common.yaml \
					--values config.yaml \
					--values secrets.yaml
