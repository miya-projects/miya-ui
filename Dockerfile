## 构建
#FROM node as build
#WORKDIR /app/

# 运行
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/nginx:spa
COPY dist/ /usr/share/nginx/html/

