## 构建
#registry.cn-hangzhou.aliyuncs.com/rxxy/node
#registry-vpc.cn-hangzhou.aliyuncs.com/rxxy/node
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/node:18.14.0 as build
WORKDIR /app/
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN --mount=type=cache,mode=0777,target=~/.cache/node_modules,id=node_module_cache yarn install
COPY ./ /app/
RUN yarn run build

#导出构件
FROM scratch AS export
COPY --from=build /app/dist/ /

# 运行
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/nginx:1.22-spa
COPY --from=export / /usr/share/nginx/html/

#COPY dist/ /usr/share/nginx/html/

