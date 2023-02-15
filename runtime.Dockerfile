# 运行
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/nginx:1.22-spa
COPY dist/ /usr/share/nginx/html/

