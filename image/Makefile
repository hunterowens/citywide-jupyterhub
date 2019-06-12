.PHONY: build publish clean

DOCKERHUB_REPO=irose/citywide-jupyterlab
DOCKER := $(if $(DOCKER),$(DOCKER),docker)

buildlog.txt: Dockerfile
	$(DOCKER) build . > buildlog.txt

build: buildlog.txt

publish: buildlog.txt
	$(eval $@_TAG := $(shell cat $< | grep "Successfully built" | awk '{ print $$3 }'))
	$(DOCKER) tag $($@_TAG) ${DOCKERHUB_REPO}:$($@_TAG)
	$(DOCKER) push ${DOCKERHUB_REPO}:$($@_TAG)

clean:
	rm buildlog.txt
