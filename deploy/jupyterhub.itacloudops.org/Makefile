.PHONY: upgrade

RELEASE=jhub
CONTEXT="arn:aws:eks:us-west-2:525978535215:cluster/EKS-bpNmPItoJlH8"

upgrade:
	kubectl config use-context ${CONTEXT}
	helm upgrade ${RELEASE} jupyterhub/jupyterhub \
					--version=0.8.2 \
					--values ../common.yaml \
					--values config.yaml \
					--values secrets.yaml
