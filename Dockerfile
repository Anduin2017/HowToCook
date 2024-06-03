# ============================
# Prepare Node Environment
FROM hub.aiursoft.cn/node:21-alpine as node-env
WORKDIR /app
COPY . .
RUN node ./.github/readme-generate.js

# ============================
# Prepare Build Environment
FROM hub.aiursoft.cn/python:3.11 as python-env
WORKDIR /app
COPY --from=node-env /app .
RUN pip install -r requirements.txt && rm node_modules -rf
RUN apt-get update && apt-get install -y weasyprint fonts-noto-cjk wget unzip
RUN wget https://gitlab.aiursoft.cn/anduin/anduinos/-/raw/master/Config/fonts.conf -O /etc/fonts/local.conf
RUN wget -P /tmp https://gitlab.aiursoft.cn/anduin/anduinos/-/raw/master/Assets/fonts.zip
RUN unzip -o /tmp/fonts.zip -d /usr/share/fonts/
RUN rm -f /tmp/fonts.zip
RUN fc-cache -fv

RUN mkdocs build

# ============================
# Prepare Runtime Environment
FROM hub.aiursoft.cn/aiursoft/static
COPY --from=python-env /app/site /data