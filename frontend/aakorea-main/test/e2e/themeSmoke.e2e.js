import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import test from 'node:test'

const APP_PORT = 4273
const APP_URL = `http://127.0.0.1:${APP_PORT}`
const EDGE_EXECUTABLE_PATH = '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const WINDOWS_TEMP_DIR = 'C:\\Users\\mam2z\\AppData\\Local\\Temp'
const PROJECT_ROOT = process.cwd()

let previewServer

test.before(async () => {
  previewServer = startPreviewServer()
  await waitForServer(APP_URL)
})

test.after(async () => {
  await stopProcess(previewServer)
})

test('home route renders with the classic public theme', async () => {
  const html = await dumpDom(APP_URL)

  assert.match(html, /data-route-surface="public"/)
  assert.match(html, /data-public-theme="classic"/)
  assert.match(html, /처음 오셨나요\? 안내를 읽고 가까운 AA 모임을 찾을 수 있습니다\./)
})

test('public preview routes keep the requested preview theme in navigation links', async () => {
  const html = await dumpDom(`${APP_URL}/meetings?themePreview=harbor`)

  assert.match(html, /data-route-surface="public"/)
  assert.match(html, /data-public-theme="harbor"/)
  assert.match(html, /테마 미리보기 · Harbor/)
  assert.match(html, /href="\/notices\?themePreview=harbor"/)
})

test('admin login honors the stored dark theme preference before React boot', async () => {
  const seedUrl = `${APP_URL}/__test__/seed-admin-theme.html?theme=dark&redirect=%2Fadmin%2Flogin`
  const html = await dumpDom(seedUrl)

  assert.match(html, /data-route-surface="admin"/)
  assert.match(html, /data-admin-theme="dark"/)
  assert.match(html, /data-admin-theme-preference="dark"/)
  assert.match(html, /운영 콘솔 로그인/)
})

async function dumpDom(url) {
  const userDataDir = `${WINDOWS_TEMP_DIR}\\aakorea-edge-smoke-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const edgeResult = await runProcess(EDGE_EXECUTABLE_PATH, [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--virtual-time-budget=5000',
    `--user-data-dir=${userDataDir}`,
    '--dump-dom',
    url,
  ])

  if (edgeResult.code !== 0) {
    throw new Error(`Edge dump failed with code ${edgeResult.code}: ${edgeResult.stderr}`)
  }

  return edgeResult.stdout
}

function startPreviewServer() {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  return spawn(
    npmCommand,
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', `${APP_PORT}`, '--strictPort'],
    {
      cwd: PROJECT_ROOT,
      env: {
        ...process.env,
        TMPDIR: '/tmp',
        TMP: '/tmp',
        TEMP: '/tmp',
      },
      stdio: 'ignore',
    },
  )
}

async function stopProcess(childProcess) {
  if (!childProcess || childProcess.exitCode !== null || childProcess.signalCode) {
    return
  }

  childProcess.kill('SIGTERM')
  await delay(250)

  if (childProcess.exitCode === null && !childProcess.signalCode) {
    childProcess.kill('SIGKILL')
  }
}

async function waitForServer(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // Wait for the preview server to accept connections.
    }

    await delay(250)
  }

  throw new Error(`Server did not become ready: ${url}`)
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''

    childProcess.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    childProcess.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    childProcess.on('error', reject)
    childProcess.on('close', (code) => {
      resolve({ code, stderr, stdout })
    })
  })
}
