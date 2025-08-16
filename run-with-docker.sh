#!/bin/bash


node_image=node:22-alpine
python_image=python:3.11
listen_port=8000

# npm builld
docker run --rm -it \
    -v $(pwd):/app \
    -w /app \
    --entrypoint /bin/sh \
    $node_image -c """
npm install --loglevel verbose
npm run build
npm run lint
"""

# mkdocs build
echo """
FROM $python_image

ENV PIP_INDEX_URL=https://repo.huaweicloud.com/repository/pypi/simple

RUN sed -i 's/deb.debian.org/mirrors.huaweicloud.com/g' /etc/apt/sources.list.d/*.sources \
    && sed -i 's/security.debian.org/mirrors.huaweicloud.com/g' /etc/apt/sources.list.d/*.sources
RUN apt-get update && apt-get install -y weasyprint fonts-noto-cjk wget unzip
RUN pip install mkdocs
COPY requirements.txt ./
RUN pip install -r requirements.txt

""" >/tmp/Dockerfile.mkdocs

docker build . -f /tmp/Dockerfile.mkdocs -t mkdocs-env
docker run --rm -it \
    -v $(pwd):/src \
    -w /app \
    -p $listen_port:8000 \
    --entrypoint /bin/bash \
    mkdocs-env -c """
for file in \$(ls /src); do
  if [ \$file != "site" -a \$file != "node_modules" ]; then  # folder to ignore for mkdocs build
    ln -s /src/\$file /app/\$file
  fi
done

mkdocs serve -a 0.0.0.0:8000
"""
