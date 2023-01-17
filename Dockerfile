## 构建
FROM node as build
# --registry=https://registry.npm.taobao.org/
RUN npm install -g yarn
WORKDIR /app/
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN --mount=type=cache,mode=0777,target=/app/node_modules,id=node_module_cache yarn install
COPY ./ /app/
RUN yarn run build

#--mount=type=cache,mode=0777,target=/root/.m2/repository/,id=maven_cache \

#导出构件
FROM scratch AS export
COPY --from=build /app/dist/ /

# 运行
FROM registry.cn-hangzhou.aliyuncs.com/rxxy/nginx:spa
COPY --from=export / /usr/share/nginx/html/

#COPY dist/ /usr/share/nginx/html/

