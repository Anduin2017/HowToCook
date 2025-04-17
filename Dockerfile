# ============================
# Prepare lint Environment
FROM node:22-alpine as lint-env
WORKDIR /app
COPY . .
RUN npm install --loglevel verbose
RUN npm run build
RUN npm run lint

# ============================
# Prepare Build Environment
FROM python:3.11 as python-env
WORKDIR /app
COPY --from=lint-env /app .
RUN apt-get update && apt-get install -y weasyprint fonts-noto-cjk wget unzip
RUN rm node_modules -rf && pip install -r requirements.txt
RUN mkdocs build

# ============================
# Prepare Runtime Environment
FROM aiursoft/static
COPY --from=python-env /app/site /data

LABEL org.opencontainers.image.source="https://github.com/Anduin2017/HowToCook"
