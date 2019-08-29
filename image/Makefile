.PHONY: build publish clean

DOCKER_REPO=525978535215.dkr.ecr.us-west-1.amazonaws.com/citywide-jupyterlab
AWS_REGION=us-west-1
DOCKER := $(if $(DOCKER),$(DOCKER),docker)

buildlog.txt: Dockerfile
	$(DOCKER) build . > buildlog.txt

build: buildlog.txt

publish: buildlog.txt
	$(eval $@_TAG := $(shell cat $< | grep "Successfully built" | awk '{ print $$3 }'))
	$(DOCKER) tag $($@_TAG) ${DOCKER_REPO}:$($@_TAG)
	$$(aws ecr get-login --no-include-email --region $(AWS_REGION))
	$(DOCKER) push ${DOCKER_REPO}:$($@_TAG)

clean:
	rm -f buildlog.txt

test: buildlog.txt
	$(eval $@_TAG := $(shell cat $< | grep "Successfully built" | awk '{ print $$3 }'))
	$(DOCKER) run -p 8888:8888 -it $($@_TAG)
