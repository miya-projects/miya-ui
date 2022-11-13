
### 安装依赖
```shell
pnpm install
```

### 新增模块
```shell
ng g ng-alain:module sys
```

```shell
ng g ng-alain:list article -m=cms
```
### 新增组件

```
ng g ng-alain:view view -m=sys -t=log
```

```shell
ng g ng-alain:curd article -m=cms
```


### 生成swagger接口客户端代码
```shell
swagger-typescript-api -p http://localhost:8083/v2/api-docs?group=%E7%B3%BB%E7%BB%9F --module-name-index 2 -o src/app/api --modular
ng g ng-alain:sta 
```
