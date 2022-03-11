# vueapp

## Project setup

```
pnpm install
```

### Compiles and hot-reloads for development

```
pnpm run serve
```

### Compiles and minifies for production

构建包时先查看 public/vendor 是否有 dll 包生成，如果没有执行 npm run dll 生成 dll 包，如果已有则直接构建

```
pnpm run dll
```

```
pnpm run build
```

### Lints and fixes files

```
pnpm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
