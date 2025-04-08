
#)####################################################################################
#   _____ _           _   _                    _   _____            _               #
#  / ____| |         | | | |                  | | |  __ \          | |              #
# | (___ | |__   __ _| |_| |_ ___ _ __ ___  __| | | |__) |___  __ _| |_ __ ___  ___ #
#  \___ \| '_ \ / _` | __| __/ _ \ '__/ _ \/ _` | |  _  // _ \/ _` | | '_ ` _ \/ __|#
#  ____) | | | | (_| | |_| ||  __/ | |  __/ (_| | | | \ \  __/ (_| | | | | | | \__ \#
# |_____/|_| |_|\__,_|\__|\__\___|_|  \___|\__,_| |_|  \_\___|\__,_|_|_| |_| |_|___/#
#####################################################################################

#
# Makefile for building, running, and testing
#

APP_NAME = frontend

# Import dotenv
ifneq (,$(wildcard ../.env))
	include ../.env
	export
endif

# Application versions
BASE_VERSION = $(shell git describe --tags --always --abbrev=0 --match='v[0-9]*.[0-9]*.[0-9]*' 2> /dev/null | sed 's/^.//')
COMMIT_HASH = $(shell git rev-parse --short HEAD)

# Gets the directory containing the Makefile
ROOT_DIR = $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

# Base container registry
SRO_BASE_REGISTRY ?= 779965382548.dkr.ecr.us-east-1.amazonaws.com
SRO_REGISTRY ?= $(SRO_BASE_REGISTRY)/sro

# The registry for this service
REGISTRY = $(SRO_REGISTRY)/$(APP_NAME)
time=$(shell date +%s)

# Protos
PROTOS_DIR = "$(ROOT_DIR)/api"
PROTO_OUT_DIR="$(ROOT_DIR)/src/protos"
PROTOS = $(shell find "$(PROTOS_DIR)" -name "*.proto")

# Versioning
VERSION=$(BASE_VERSION)
ifeq ($(VERSION),)
	VERSION := 0.0.0
endif

VERSION_PARTS=$(subst ., ,$(VERSION))
MAJOR_VERSION=$(word 1,$(VERSION_PARTS))
MINOR_VERSION=$(word 2,$(VERSION_PARTS))
PATCH_VERSION=$(word 3,$(VERSION_PARTS))

deploy: aws-docker-login push

docker:
	docker build --build-arg APP_VERSION=$(BASE_VERSION) -t sro-$(APP_NAME) -f Dockerfile .

aws-docker-login:
	aws ecr get-login-password | docker login --username AWS --password-stdin $(SRO_BASE_REGISTRY)

push:
	docker tag sro-$(APP_NAME) $(SRO_REGISTRY)/$(APP_NAME):latest
	docker tag sro-$(APP_NAME) $(SRO_REGISTRY)/$(APP_NAME):$(BASE_VERSION)
	docker tag sro-$(APP_NAME) $(SRO_REGISTRY)/$(APP_NAME):$(BASE_VERSION)-$(COMMIT_HASH)
	docker push $(SRO_REGISTRY)/$(APP_NAME):latest
	docker push $(SRO_REGISTRY)/$(APP_NAME):$(BASE_VERSION)
	docker push $(SRO_REGISTRY)/$(APP_NAME):$(BASE_VERSION)-$(COMMIT_HASH)

docker-push: docker push

.PHONY: clean-protos protos $(PROTOS)

clean-protos:
	rm -rf "$(PROTO_OUT_DIR)"
	mkdir -p "$(PROTO_OUT_DIR)"
	git submodule update --remote --merge

protos: clean-protos $(PROTOS)

$(PROTOS):
	protoc "$@" \
		-I $(PROTOS_DIR) \
		--plugin=protoc-gen-ts=$(ROOT_DIR)/node_modules/.bin/protoc-gen-ts \
    --ts_opt=long_type_number \
		--ts_out=$(PROTO_OUT_DIR)



# --plugin=protoc-gen-grpc-web=$(ROOT_DIR)/node_modules/.bin/protoc-gen-grpc-web \
# --grpc-web_out=import_style=typescript,mode=grpcweb:$(PROTO_DIR) \
# --plugin=protoc-gen-js=$(ROOT_DIR)/node_modules/.bin/protoc-gen-js \
# --js_out="import_style=commonjs,binary:$(PROTO_DIR)"
# --plugin=protoc-gen-ts=$(ROOT_DIR)/node_modules/.bin/protoc-gen-ts \
# --ts_out="service=grpc-web:$(PROTO_DIR)"

git: git-patch
git-major:
	git tag v$(shell echo $(MAJOR_VERSION)+1 | bc).0.0
	git push
	git push --tags
git-minor:
	git tag v$(MAJOR_VERSION).$(shell echo $(MINOR_VERSION)+1 | bc).0
	git push
	git push --tags
git-patch:
	git tag v$(MAJOR_VERSION).$(MINOR_VERSION).$(shell echo $(PATCH_VERSION)+1 | bc)
	git push
	git push --tags

