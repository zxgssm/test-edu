import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const CLOUDFUNCTION_ROOT = 'cloudfunctions/'
const COMMON_FILES = ['auth.js', 'db.js', 'response.js', 'date.js', 'stats.js', 'index.js']
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'cloudfunctions')
const targets = [
  join(root, 'dist/dev/mp-weixin'),
  join(root, 'dist/build/mp-weixin'),
]

function patchProjectConfig(targetDir) {
  const configPath = join(targetDir, 'project.config.json')
  if (!existsSync(configPath)) return

  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  if (config.cloudfunctionRoot === CLOUDFUNCTION_ROOT) return

  config.cloudfunctionRoot = CLOUDFUNCTION_ROOT
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
  console.log(`已写入 cloudfunctionRoot → ${configPath}`)
}

function getFunctionNames(cloudRoot) {
  return readdirSync(cloudRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'common')
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(cloudRoot, name, 'index.js')))
}

function bundleCommonIntoFunction(functionDir, commonSrc) {
  const commonDest = join(functionDir, 'common')
  rmSync(commonDest, { recursive: true, force: true })
  mkdirSync(commonDest, { recursive: true })

  for (const file of COMMON_FILES) {
    const from = join(commonSrc, file)
    if (existsSync(from)) {
      cpSync(from, join(commonDest, file))
    }
  }

  const indexPath = join(functionDir, 'index.js')
  const content = readFileSync(indexPath, 'utf8')
  if (content.includes("../common/")) {
    writeFileSync(
      indexPath,
      content.replace(/require\('\.\.\/common\//g, "require('./common/"),
    )
  }

  const pkgPath = join(functionDir, 'package.json')
  if (!existsSync(pkgPath)) return

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const commonPkgPath = join(commonSrc, 'package.json')
  if (existsSync(commonPkgPath)) {
    const commonPkg = JSON.parse(readFileSync(commonPkgPath, 'utf8'))
    pkg.dependencies = {
      ...commonPkg.dependencies,
      ...pkg.dependencies,
    }
  }

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

function prepareCloudfunctions(destCloudRoot) {
  const commonSrc = join(destCloudRoot, 'common')
  if (!existsSync(commonSrc)) {
    console.warn(`跳过 bundle：未找到 ${commonSrc}`)
    return
  }

  for (const name of getFunctionNames(destCloudRoot)) {
    bundleCommonIntoFunction(join(destCloudRoot, name), commonSrc)
    console.log(`  已 bundle common → ${name}/common`)
  }
}

if (!existsSync(src)) {
  console.error('cloudfunctions 目录不存在')
  process.exit(1)
}

// 先打包仓库根目录 cloudfunctions，便于开发者工具直接右键部署
prepareCloudfunctions(src)
console.log('已 bundle 仓库 cloudfunctions/（部署前请确认已执行本脚本）')

for (const target of targets) {
  if (!existsSync(target)) continue

  const dest = join(target, 'cloudfunctions')
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`已同步 cloudfunctions → ${dest}`)

  patchProjectConfig(target)
}
