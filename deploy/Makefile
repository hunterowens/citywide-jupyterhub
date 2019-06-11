.PHONY: upgrade

RELEASE=jhub

upgrade:
	helm upgrade ${RELEASE} jupyterhub/jupyterhub \
  	--version=0.8.2 \
  	--values config.yaml \
		--values secrets.yaml
