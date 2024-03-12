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
RUN pip install -r requirements.txt
RUN mkdocs build --strict

# ============================
# Prepare Runtime Environment
FROM hub.aiursoft.cn/aiursoft/static
COPY --from=python-env /app/site /data
