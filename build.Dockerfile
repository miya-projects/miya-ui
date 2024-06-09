## 构建
#registry.cn-hangzhou.aliyuncs.com/rxxy/node
#registry-vpc.cn-hangzhou.aliyuncs.com/rxxy/node
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/node:20.14.0 as build
WORKDIR /app/
COPY ./package.json /app/
COPY ./package-lock.json /app/
#COPY ./yarn.lock /app/
#--mount=type=cache,mode=0777,target=/app/node_modules,id=node_module_cache
RUN npm install
COPY ./ /app/
RUN npm run build

#导出构件
FROM scratch AS export
COPY --from=build /app/dist/browser/ /

# 运行
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/nginx:1.22-spa
COPY --from=export / /usr/share/nginx/html/
