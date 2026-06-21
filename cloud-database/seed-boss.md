# 云数据库种子数据

## 1. 创建集合

在微信云开发控制台创建：

- `institutions`
- `users`
- `orders`

建议权限：**所有用户不可读写**（仅云函数访问）。

## 2. 快速初始化（推荐）

1. 执行 `pnpm sync:cloud`（会把 `common/` 打包进各云函数，**必须**做这步再部署）
2. 在微信开发者工具中，右键 `cloudfunctions/seed_boss` → **上传并部署：云端安装依赖**
3. 云开发控制台 → 云函数 → `seed_boss` → **云端测试**，参数填 `{}`
4. 返回 `初始化完成` 即已插入机构 + 老板账号

> **若测试失败（ret code -1、内存 0KB、无日志）**：通常是 `../common/` 未被打包进云函数。请重新 `pnpm sync:cloud` 后，**重新上传部署** `seed_boss`（不要只测不部署）。

默认老板账号：

| 字段 | 值 |
|------|-----|
| 手机号 | `13900000001` |
| 初始密码 | `Boss@123` |
| mustChangePassword | `true` |
| status | `pending_bind` |

> **注意：** 老板记录不要写入 `openid` 字段。

## 3. 手动插入（可选）

### institutions

```json
{
  "name": "阳光教育",
  "monthlyTarget": 100000,
  "createdAt": "<serverDate>"
}
```

### users（老板）

使用 `cloudfunctions/common/auth.js` 的 `hashPassword('Boss@123')` 生成 `passwordHash` 后插入：

```json
{
  "institutionId": "<institutions._id>",
  "name": "机构老板",
  "phone": "13900000001",
  "role": "boss",
  "passwordHash": "<哈希>",
  "mustChangePassword": true,
  "status": "pending_bind",
  "target": 0,
  "createdAt": "<serverDate>"
}
```

## 4. 微信开发者工具配置

1. 运行 `pnpm dev:mp-weixin` 编译小程序（构建结束会自动同步 `cloudfunctions/` 并写入 `cloudfunctionRoot`）
2. 若仅改了云函数、未重新编译，可手动执行 `pnpm sync:cloud`
3. 用微信开发者工具打开 **`dist/dev/mp-weixin`** 目录
4. 确认 `project.config.json` 已包含 `"cloudfunctionRoot": "cloudfunctions/"`（由同步脚本自动写入）
5. 在 `src/config/cloud.js` 填入 `CLOUD_ENV_ID`
6. 在 `src/manifest.json` 的 `mp-weixin.appid` 填入小程序 AppID
7. 执行 `pnpm sync:cloud` 后，右键各云函数 → **上传并部署：云端安装依赖**
   - 部署前可在函数目录确认存在 `common/response.js`，且 `index.js` 里是 `require('./common/...')` 而非 `../common/`
8. 先部署并测试 `seed_boss` 完成数据初始化

## 5. 索引建议

- `users.openid`（唯一，稀疏：未绑定不写该字段）
- `users.phone`（唯一）
- `orders.institutionId` + `createdAt`
- `orders.staffId` + `createdAt`
