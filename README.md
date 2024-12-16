# 放宽cookie设置

访问此站点，将会将所携带的 cookie 全部重置，会设置下方属性

```js
{
    domain: '默认是访问此站点的上级域名，可以通过url的 domain 参数进行指定',
    sameSite: 'none',
    secure: true,
}
```

需要将此项目部署到 https 站点下
