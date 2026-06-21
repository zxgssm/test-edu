# 教培业绩助手 MVP — 微信云开发实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在微信小程序中跑通 MVP 全链路：云开发认证 → 员工管理 → 录单 → 业绩汇总，满足 `docs/REQUIREMENTS.md` §3 场景 A～E。

**Architecture:** UniApp 前端（`src/`）仅通过 `src/api/*` 调用业务；微信云函数（`cloudfunctions/`）访问云数据库三集合 `institutions` / `users` / `orders`；云函数公共逻辑放 `cloudfunctions/common/`；编译产物 `dist/dev/mp-weixin` 需包含 `cloudfunctions` 供微信开发者工具部署。认证前端 + Mock 已完成，本计划聚焦云开发与业务页接真数据。

**Tech Stack:** UniApp 3 + Vue 3、`unh` 构建、微信云开发（云函数 + 云数据库）、`wx-server-sdk`、`bcryptjs`（云函数密码哈希）

**Spec:** `docs/REQUIREMENTS.md` v0.4

---

## 文件结构总览

| 路径 | 职责 |
|------|------|
| `cloudfunctions/common/` | 数据库、密码、token、响应格式、鉴权 |
| `cloudfunctions/auth_silentLogin/` | 静默登录 |
| `cloudfunctions/auth_login/` | 手机号密码登录 + 绑定 openid |
| `cloudfunctions/auth_changePassword/` | 改密 |
| `cloudfunctions/staff_create/` | 老板新增员工 |
| `cloudfunctions/staff_list/` | 员工列表 |
| `cloudfunctions/order_create/` | 员工录单 |
| `cloudfunctions/order_list/` | 员工订单列表 |
| `cloudfunctions/boss_dashboard/` | 老板首页汇总 |
| `cloudfunctions/boss_target/` | 老板业绩目标 |
| `cloudfunctions/boss_ranking/` | 老板本月排行 |
| `cloudfunctions/staff_dashboard/` | 员工首页汇总 |
| `src/untils/cloud.js` | `wx.cloud.callFunction` 封装 |
| `src/config/cloud.js` | 云环境 ID、是否使用 Mock |
| `src/api/auth.js` | Mock / 云函数切换 |
| `src/api/staff.js` | 员工 API（新建） |
| `src/api/order.js` | 订单 API（新建） |
| `scripts/sync-cloudfunctions.mjs` | 编译后复制 cloudfunctions 到 dist |
| `cloud-database/seed-boss.md` | 老板种子数据操作说明 |

---

## Phase 0：前置条件（人工）

- [ ] 微信公众平台注册小程序，获取 **AppID**
- [ ] 开通云开发，创建环境，记录 **环境 ID**（如 `cloud1-xxxxxxxx`）
- [ ] `src/manifest.json` → `mp-weixin.appid` 填入 AppID
- [ ] 安装微信开发者工具，导入项目目录 `dist/dev/mp-weixin`（Task 1 编译后）

---

## Task 1: 云函数目录与编译同步脚本

**Files:**
- Create: `cloudfunctions/common/package.json`
- Create: `scripts/sync-cloudfunctions.mjs`
- Modify: `package.json`（添加 `sync:cloud` 脚本）
- Modify: `src/config/cloud.js`

- [ ] **Step 1: 创建云环境配置**

创建 `src/config/cloud.js`：

```js
// 替换为你的云环境 ID；留空则 MP 端回退 Mock
export const CLOUD_ENV_ID = ''

// 微信小程序且已配置环境 ID 时走云函数
export const useCloud =
  typeof wx !== 'undefined' &&
  !!wx.cloud &&
  !!CLOUD_ENV_ID
```

- [ ] **Step 2: 创建 cloudfunctions 公共包占位**

创建 `cloudfunctions/common/package.json`：

```json
{
  "name": "edu-cloud-common",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 3: 创建同步脚本**

创建 `scripts/sync-cloudfunctions.mjs`：

```js
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'cloudfunctions')
const targets = [
  join(root, 'dist/dev/mp-weixin'),
  join(root, 'dist/build/mp-weixin'),
]

if (!existsSync(src)) {
  console.error('cloudfunctions 目录不存在')
  process.exit(1)
}

for (const target of targets) {
  if (!existsSync(target)) continue
  const dest = join(target, 'cloudfunctions')
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`已同步 cloudfunctions → ${dest}`)
}
```

- [ ] **Step 4: 修改 package.json scripts**

在 `package.json` 的 `scripts` 中添加：

```json
"sync:cloud": "node scripts/sync-cloudfunctions.mjs",
"dev:mp-weixin": "unh dev mp-weixin && node scripts/sync-cloudfunctions.mjs"
```

> Windows 下 `&&` 可用；若 unh 为长期 watch，改为编译完成后**手动**执行 `pnpm sync:cloud`。

- [ ] **Step 5: 验证**

```bash
pnpm run dev:mp-weixin
# 另开终端（编译出 dist 后）
pnpm run sync:cloud
```

预期：`dist/dev/mp-weixin/cloudfunctions/` 目录存在。

---

## Task 2: 云数据库集合与老板种子数据

**Files:**
- Create: `cloud-database/seed-boss.md`
- Create: `cloudfunctions/seed_boss/index.js`（可选，一次性初始化云函数）

- [ ] **Step 1: 在云开发控制台创建集合**

集合名：`institutions`、`users`、`orders`（权限建议：仅云函数可写，读走云函数）。

- [ ] **Step 2: 编写种子说明**

创建 `cloud-database/seed-boss.md`，内容包含：

1. 插入 `institutions`：`{ name: "阳光教育", monthlyTarget: 100000, createdAt: <serverDate> }`
2. 用 Task 3 的 `hashPassword('Boss@123')` 生成哈希后插入 `users` 老板记录（**不要写 openid 字段**）：

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

- [ ] **Step 3:（可选）部署一次性云函数 `seed_boss`**

用于开发环境快速初始化，执行后删除或禁用该函数。逻辑：若 `users` 中无 boss 则插入机构 + 老板。

- [ ] **Step 4: 验证**

云开发控制台 → 数据库 → `users` 存在 1 条 `role: boss`，`phone: 13900000001`，且无 `openid` 字段。

---

## Task 3: 云函数公共模块 `cloudfunctions/common`

**Files:**
- Create: `cloudfunctions/common/index.js`
- Create: `cloudfunctions/common/db.js`
- Create: `cloudfunctions/common/auth.js`
- Create: `cloudfunctions/common/response.js`
- Create: `cloudfunctions/common/date.js`

- [ ] **Step 1: 统一响应**

`cloudfunctions/common/response.js`：

```js
exports.ok = (data = {}) => ({ code: 0, message: 'ok', data })
exports.fail = (code, message) => ({ code, message, data: null })
```

- [ ] **Step 2: 日期范围（本月/今日）**

`cloudfunctions/common/date.js`：

```js
exports.getTodayRange = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

exports.getMonthRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  return { start, end }
}
```

- [ ] **Step 3: 密码与 token**

`cloudfunctions/common/auth.js`：

```js
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

exports.hashPassword = (plain) => bcrypt.hashSync(plain, SALT_ROUNDS)
exports.verifyPassword = (plain, hash) => bcrypt.compareSync(plain, hash)

exports.createToken = (userId) => `edu-${userId}-${Date.now()}`

exports.sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user
  return { ...rest, id: user._id }
}

exports.getOpenid = (cloud) => cloud.getWXContext().OPENID
```

- [ ] **Step 4: 数据库与鉴权**

`cloudfunctions/common/db.js`：

```js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.db = db
exports._ = _

exports.findUserByOpenid = async (openid) => {
  const { data } = await db.collection('users').where({ openid }).limit(1).get()
  return data[0] || null
}

exports.findUserByPhone = async (phone) => {
  const { data } = await db.collection('users').where({ phone }).limit(1).get()
  return data[0] || null
}

exports.isOpenidUsedByOther = async (openid, excludeUserId) => {
  const { data } = await db.collection('users').where({ openid }).limit(1).get()
  const other = data[0]
  return other && other._id !== excludeUserId
}

exports.getAuthUser = async (event, cloud) => {
  const { OPENID } = cloud.getWXContext()
  const token = event.token || ''
  const userId = (token.match(/^edu-([^-]+)-/) || [])[1]
  if (!userId) return null
  const { data } = await db.collection('users').doc(userId).get()
  const user = data
  if (!user || user.openid !== OPENID) return null
  return user
}
```

- [ ] **Step 5: 入口聚合**

`cloudfunctions/common/index.js` 导出上述模块（各云函数 `require('../common')`）。

- [ ] **Step 6: 验证**

各业务云函数目录的 `package.json` 添加对 common 的相对引用方式：云函数内使用 `require('./common')` 需将 common 复制到每个函数，**更简单做法**：每个云函数 `index.js` 顶部 `require('../common/auth')` 等，部署时对每个函数执行「云端安装依赖」，common 作为兄弟目录被 Node 解析（微信云开发支持云函数间 require 同级目录）。

> **推荐：** 每个云函数 `package.json` 不单独装 bcrypt，在 `cloudfunctions/common` 执行一次 `npm install`，各函数 `require('../common/auth')`。

---

## Task 4: 云函数 `auth_silentLogin`

**Files:**
- Create: `cloudfunctions/auth_silentLogin/index.js`
- Create: `cloudfunctions/auth_silentLogin/package.json`

- [ ] **Step 1: 实现**

`cloudfunctions/auth_silentLogin/index.js`：

```js
const cloud = require('wx-server-sdk')
const { ok, fail } = require('../common/response')
const { findUserByOpenid } = require('../common/db')
const { createToken, sanitizeUser, getOpenid } = require('../common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const openid = getOpenid(cloud)
  if (!openid) return fail(401, '无法获取 OPENID')

  const user = await findUserByOpenid(openid)
  if (!user) {
    return ok({ status: 'need_login' })
  }

  const token = createToken(user._id)
  const publicUser = sanitizeUser(user)

  if (user.mustChangePassword) {
    return ok({ status: 'need_change_password', token, user: publicUser })
  }

  return ok({ status: 'ok', token, user: publicUser })
}
```

`package.json`：`{ "dependencies": { "wx-server-sdk": "~2.6.3" } }`

- [ ] **Step 2: 部署**

微信开发者工具 → `cloudfunctions/auth_silentLogin` → 右键「上传并部署：云端安装依赖」。

- [ ] **Step 3: 验证**

云开发控制台 → 云函数 → 测试，`{}` 返回 `{ code:0, data:{ status:'need_login' } }`（未绑定账号时）。

---

## Task 5: 云函数 `auth_login`

**Files:**
- Create: `cloudfunctions/auth_login/index.js`
- Create: `cloudfunctions/auth_login/package.json`

- [ ] **Step 1: 实现**

```js
const cloud = require('wx-server-sdk')
const { ok, fail } = require('../common/response')
const {
  db,
  findUserByPhone,
  isOpenidUsedByOther,
} = require('../common/db')
const {
  verifyPassword,
  createToken,
  sanitizeUser,
  getOpenid,
} = require('../common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { phone, password } = event
  const openid = getOpenid(cloud)

  if (!phone || !password) return fail(401, '手机号或密码错误')
  if (!openid) return fail(401, '无法获取 OPENID')

  const user = await findUserByPhone(phone)
  if (!user) return fail(404, '账号不存在，请联系老板')
  if (!verifyPassword(password, user.passwordHash)) {
    return fail(401, '手机号或密码错误')
  }

  if (await isOpenidUsedByOther(openid, user._id)) {
    return fail(409, '该微信已绑定其他账号，请联系老板处理')
  }

  await db.collection('users').doc(user._id).update({
    data: {
      openid,
      status: 'active',
    },
  })

  const updated = { ...user, openid, status: 'active' }
  const token = createToken(user._id)

  return ok({
    token,
    user: sanitizeUser(updated),
    mustChangePassword: !!updated.mustChangePassword,
  })
}
```

- [ ] **Step 2: 部署并测试**

测试参数：`{ "phone": "13900000001", "password": "Boss@123" }`  
预期：`code: 0`，`data.token` 存在，`data.mustChangePassword: true`。

- [ ] **Step 3: 验证数据库**

`users` 中老板记录出现 `openid` 字段，`status: active`。

---

## Task 6: 云函数 `auth_changePassword`

**Files:**
- Create: `cloudfunctions/auth_changePassword/index.js`

- [ ] **Step 1: 实现**

```js
const cloud = require('wx-server-sdk')
const { ok, fail } = require('../common/response')
const { db, getAuthUser } = require('../common/db')
const { verifyPassword, hashPassword, sanitizeUser } = require('../common/auth')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { oldPassword, newPassword, token } = event
  const user = await getAuthUser(event, cloud)
  if (!user) return fail(401, '请先登录')
  if (!verifyPassword(oldPassword, user.passwordHash)) {
    return fail(401, '原密码错误')
  }

  await db.collection('users').doc(user._id).update({
    data: {
      passwordHash: hashPassword(newPassword),
      mustChangePassword: false,
    },
  })

  const updated = {
    ...user,
    mustChangePassword: false,
  }

  return ok({ user: sanitizeUser(updated) })
}
```

- [ ] **Step 2: 部署**

- [ ] **Step 3: 验证**

用 Task 5 返回的 `token` + 旧密码 / 新密码测试，预期 `mustChangePassword: false`。

---

## Task 7: 前端接入云函数

**Files:**
- Create: `src/untils/cloud.js`
- Modify: `src/api/auth.js`
- Modify: `src/App.vue`
- Modify: `src/pages/modules/staff/user/password.vue`（传 token）

- [ ] **Step 1: callFunction 封装**

`src/untils/cloud.js`：

```js
import { CLOUD_ENV_ID } from '@/config/cloud'

export function callCloud(name, data = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    if (!wx.cloud) {
      reject(new Error('wx.cloud 不可用'))
      return
    }
    const { getToken } = require('@/untils/auth')
    const token = getToken()
    wx.cloud.callFunction({
      name,
      data: { ...data, ...(token ? { token } : {}) },
      success: (res) => resolve(res.result),
      fail: reject,
    })
    // #endif
    // #ifndef MP-WEIXIN
    reject(new Error('仅支持微信小程序'))
    // #endif
  })
}
```

- [ ] **Step 2: 修改 auth.js**

```js
import { useCloud } from '@/config/cloud'
import { callCloud } from '@/untils/cloud'
import {
  mockChangePassword,
  mockCreateStaff,
  mockLogin,
  mockWechatSilentLogin,
} from '@/mock/auth'

export const wechatSilentLogin = (data) => {
  if (!useCloud) return mockWechatSilentLogin(data)
  return callCloud('auth_silentLogin', data)
}

export const login = (data) => {
  if (!useCloud) return mockLogin(data)
  return callCloud('auth_login', data)
}

export const changePassword = (data) => {
  if (!useCloud) return mockChangePassword(data)
  return callCloud('auth_changePassword', data)
}

export const createStaffAccount = (data) => {
  if (!useCloud) return mockCreateStaff(data)
  return callCloud('staff_create', data)
}
```

> `useCloud` 需在 `config/cloud.js` 导出；小程序端 `CLOUD_ENV_ID` 填好后为 `true`。

- [ ] **Step 3: App.vue 初始化**

```js
import { onLaunch } from '@dcloudio/uni-app'
import { CLOUD_ENV_ID } from '@/config/cloud'

onLaunch(() => {
  // #ifdef MP-WEIXIN
  if (wx.cloud && CLOUD_ENV_ID) {
    wx.cloud.init({ env: CLOUD_ENV_ID, traceUser: true })
  }
  // #endif
})
```

- [ ] **Step 4: 关闭入口页 Mock 按钮（联调时）**

`pages/entrance/index.vue` 中 Mock 按钮用 `#ifdef` 或 `import.meta.env.DEV && !useCloud` 包裹。

- [ ] **Step 5: 验证（场景 A 前半）**

1. `CLOUD_ENV_ID` 填入真实环境 ID  
2. `pnpm dev:mp-weixin` + `pnpm sync:cloud`  
3. 微信开发者工具打开 `dist/dev/mp-weixin`  
4. 老板首次打开 → 登录页 → `13900000001` / `Boss@123` → 改密 → 老板首页  

---

## Task 8: 员工管理云函数 + 前端

**Files:**
- Create: `cloudfunctions/staff_create/index.js`
- Create: `cloudfunctions/staff_list/index.js`
- Create: `src/api/staff.js`
- Modify: `src/pages/modules/boss/staff/index.vue`
- Modify: `src/api/auth.js`（`createStaffAccount` 已指向 staff_create）

- [ ] **Step 1: staff_create**

逻辑要点：
- `getAuthUser` 校验老板角色
- 检查 `phone` 不重复
- `passwordHash = hashPassword(password)`
- 写入 `role:'staff'`, `status:'pending_bind'`, `mustChangePassword:true`，**不写 openid**

- [ ] **Step 2: staff_list**

- 老板鉴权
- 查同 `institutionId` 下 `role: staff` 列表
- 返回 `{ list: [{ id, name, phone, target, status }] }`

- [ ] **Step 3: 前端 staff/index.vue**

`onMounted` 调用 `fetchStaffList()` 替换 `@/mock/dashboard` 的 `teachers`。

- [ ] **Step 4: 验证（场景 A 步骤 6）**

老板添加李老师 `13800000002` / `Staff@123` / 目标 10000，列表显示「待绑定」。

---

## Task 9: 订单云函数 + 前端

**Files:**
- Create: `cloudfunctions/order_create/index.js`
- Create: `cloudfunctions/order_list/index.js`
- Create: `src/api/order.js`
- Modify: `src/pages/modules/staff/order/create.vue`
- Modify: `src/pages/modules/staff/order/list.vue`

- [ ] **Step 1: order_create**

```js
// 员工鉴权；写入 orders：
{
  institutionId, staffId, staffName,
  studentName, courseName, amount: Number(amount), remark: '',
  createdAt: db.serverDate(),
}
```

校验：`amount > 0`，必填字段非空。

- [ ] **Step 2: order_list**

员工鉴权；`where({ staffId }).orderBy('createdAt','desc').limit(50)`

- [ ] **Step 3: 前端 create.vue**

```js
import { createOrder } from '@/api/order'

const saveOrder = async () => {
  const res = await createOrder({ ...form, amount: Number(form.amount) })
  if (res.code !== 0) { uni.showToast({ title: res.message, icon: 'none' }); return }
  uni.showToast({ title: '订单已保存', icon: 'success' })
  uni.navigateBack()
}
```

- [ ] **Step 4: 验证（场景 B 步骤 4～5）**

员工录单 1200 元，订单列表可见。

---

## Task 10: 业绩统计云函数

**Files:**
- Create: `cloudfunctions/common/stats.js`
- Create: `cloudfunctions/boss_dashboard/index.js`
- Create: `cloudfunctions/boss_target/index.js`
- Create: `cloudfunctions/boss_ranking/index.js`
- Create: `cloudfunctions/staff_dashboard/index.js`

- [ ] **Step 1: stats 公共聚合**

`cloudfunctions/common/stats.js`：

```js
const { db, _ } = require('./db')
const { getTodayRange, getMonthRange } = require('./date')

async function sumOrders(where, range) {
  const { start, end } = range
  const { data } = await db.collection('orders').where({
    ...where,
    createdAt: _.gte(start).and(_.lte(end)),
  }).get()
  return data.reduce((sum, o) => sum + Number(o.amount || 0), 0)
}

exports.getInstitutionStats = async (institutionId) => {
  const where = { institutionId }
  const todayAmount = await sumOrders(where, getTodayRange())
  const monthAmount = await sumOrders(where, getMonthRange())
  const { data: inst } = await db.collection('institutions').doc(institutionId).get()
  const monthTarget = inst?.monthlyTarget || 0
  const monthProgress = monthTarget ? Math.min(100, Math.round((monthAmount / monthTarget) * 100)) : 0
  return { todayAmount, monthAmount, monthTarget, monthProgress }
}

exports.getStaffStats = async (staffId, target) => {
  const where = { staffId }
  const todayAmount = await sumOrders(where, getTodayRange())
  const monthAmount = await sumOrders(where, getMonthRange())
  const monthProgress = target ? Math.min(100, Math.round((monthAmount / target) * 100)) : 0
  return { todayAmount, monthAmount, monthTarget: target, monthProgress }
}
```

- [ ] **Step 2: boss_dashboard / boss_target**

返回 REQUIREMENTS §6.4 / §6.5 字段；`boss_target` 额外返回 `completionRate`（= monthProgress）。

- [ ] **Step 3: boss_ranking**

- 查 `status:'active'` 且 `role:'staff'` 同机构员工
- 每人聚合本月 `orders` 金额
- 计算 `rate = amount/target*100`
- 按 `amount` 降序

- [ ] **Step 4: staff_dashboard**

员工鉴权 + `getStaffStats(user._id, user.target)`。

- [ ] **Step 5: 修改 api/dashboard.js**

```js
import { useCloud } from '@/config/cloud'
import { callCloud } from '@/untils/cloud'

export const queryBossDashboard = () => {
  if (!useCloud) return Promise.resolve({ code: 0, data: { /* mock */ } })
  return callCloud('boss_dashboard')
}
// 同理 staff_dashboard、boss_target、boss_ranking
```

- [ ] **Step 6: 接入页面**

- `boss/home/index.vue`：`onMounted` 拉 `queryBossDashboard`
- `boss/target/index.vue`：拉 `boss_target`
- `boss/ranking/index.vue`：拉 `boss_ranking`，仅本月 Tab 用真数据
- `staff/home/index.vue`：拉 `queryStaffDashboard`

- [ ] **Step 7: 验证（场景 C）**

老板首页今日/本月 1200；排行李老师第 1。

---

## Task 11: 端到端验收

**Files:**
- Modify: `docs/REQUIREMENTS.md` §1.4 / §10 进度勾选

- [ ] **Step 1: 场景 A** — 老板首次登录、改密、添加员工
- [ ] **Step 2: 场景 B** — 员工登录、改密、录单
- [ ] **Step 3: 场景 C** — 老板看汇总与排行
- [ ] **Step 4: 场景 D** — 关闭重开静默登录
- [ ] **Step 5: 场景 E** — 换微信（可用另一测试号或清库 openid 模拟）
- [ ] **Step 6: 更新 REQUIREMENTS.md**

将 §2.2 成功标准、§10 云函数列标为 ✅。

---

## Spec 覆盖自检

| 需求 | 任务 |
|------|------|
| 静默登录 + 密码登录 + 改密 | Task 4～7 |
| 老板种子数据 | Task 2 |
| 员工创建含初始密码 | Task 8 |
| 录单 + 列表 | Task 9 |
| 老板/员工业绩汇总 | Task 10 |
| 本月排行 | Task 10 |
| 换微信重绑 | Task 5 |
| openid 冲突 | Task 5 |
| 密码哈希 | Task 3 |
| 前端 api 分层 | Task 7～10 |
| §3 场景 A～E | Task 11 |

**刻意不做（本计划不包含）：** 趋势图、环比、员工编辑、订单作废、多机构 SaaS。

---

## 风险与注意事项

1. **cloudfunctions 同步：** 每次改云函数后需 `pnpm sync:cloud` 再在微信工具中重新部署。
2. **openid 稀疏唯一：** 未绑定员工**不要写** `openid: ""`，应省略字段。
3. **数据库权限：** 客户端直连数据库需关闭或只读；MVP 全部走云函数。
4. **token 安全：** MVP 为简易 token；上线前可改为云数据库存 session 或 JWT。
5. **H5 调试：** `useCloud` 为 false 时仍走 Mock，不影响 H5 预览。

---

## 建议执行顺序（一览）

```
Task 1 → 2 → 3 → 4 → 5 → 6 → 7（认证闭环）
       → 8（员工）→ 9（订单）→ 10（统计）→ 11（验收）
```

每完成一个 Task 部署相关云函数并在真机/模拟器验证后再进入下一 Task。
