.PHONY: build publish clean

AWS_PROFILE=default
ECR_REPO=525978535215.dkr.ecr.us-west-1.amazonaws.com/citywide-jupyterlab
AWS_REGION=us-west-2
GCR_REPO=gcr.io/ita-kubernetes-poc/citywide-jupyterlab
DOCKER := $(if $(DOCKER),$(DOCKER),docker)

buildlog.txt: Dockerfile
	$(DOCKER) build . > buildlog.txt

build: buildlog.txt

ecr: buildlog.txt 
	$(eval $@_TAG := $(shell cat $< | grep "Successfully built" | tail -n 1 | awk '{ print $$3 }'))
	$(DOCKER) tag $($@_TAG) ${ECR_REPO}:$($@_TAG)
	$$(aws ecr get-login --no-include-email --region $(AWS_REGION) --profile $AWS_PROFILE)
	$(DOCKER) push ${ECR_REPO}:$($@_TAG)

gcr: buildlog.txt
	$(eval $@_TAG := $(shell cat $< | grep "Successfully built" | tail -n 1 | awk '{ print $$3 }'))
	$(DOCKER) tag $($@_TAG) ${GCR_REPO}:$($@_TAG)
	$(DOCKER) push ${GCR_REPO}:$($@_TAG)

clean:
	rm -f buildlog.txt

test: buildlog.txt
	$(eval $@_TAG := $(shell cat $< | tail -n 1 | grep "Successfully built" | awk '{ print $$3 }'))
	$(DOCKER) run -p 8888:8888 -it $($@_TAG)
