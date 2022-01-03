
### 安装依赖
```shell
pnpm install
```

### 新增组件

```
ng g ng-alain:view view -m=sys -t=log
```

### 生成swagger接口客户端代码
```shell
swagger-typescript-api -p http://localhost:8083/v2/api-docs?group=%E7%B3%BB%E7%BB%9F --module-name-index 2 -o src/app/api --modular
```
