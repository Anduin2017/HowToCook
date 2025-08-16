#!/bin/bash

run_in_docker() {
    image="$1"
    command="$2"

    docker run --rm -it \
        -v $(pwd):/app \
        -w /app \
        --entrypoint /bin/sh \
        $image -c "$command"
}


node_image=node:22-alpine
python_image=python:3.11

run_in_docker $node_image "npm install --loglevel verbose"
run_in_docker $node_image "npm run build"
run_in_docker $node_image "npm run lint"

run_in_docker $python_image "apt-get update && apt-get install -y weasyprint fonts-noto-cjk wget unzip"
run_in_docker $python_image "rm node_modules -rf && pip install -r requirements.txt"
run_in_docker $python_image "pip install mkdocs && mkdocs build"

# Tips: when we clone the remote repo to local, we would found the image files are unabe to open and the contents are like such:
#   version https://git-lfs.github.com/spec/v1
#   oid sha256:4d7a214614ab2935c943f9e0ff69d22eadbb8f32b1258daaa5e2ca24d17e2393
#   size 123456789
# Then we have to install git-lfs (using `brew` for example) and do the following:
#   git lfs install
#   git lfs pull
#   git lfs ls-files  (check which file is managed by LFS)
# And now you can open files properly
