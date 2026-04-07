import assert from 'node:assert/strict'
import test from 'node:test'

import { parseRoute } from '../src/app/routeDefinitions.js'

test('parseRoute keeps search metadata for public meeting routes', () => {
  const route = parseRoute('/meetings', '?province=SEOUL&dayOfWeek=MONDAY&themePreview=harbor')

  assert.equal(route.name, 'meetings')
  assert.equal(route.section, 'public')
  assert.equal(route.search, '?province=SEOUL&dayOfWeek=MONDAY&themePreview=harbor')
  assert.equal(route.province, 'SEOUL')
  assert.equal(route.dayOfWeek, 'MONDAY')
})

test('parseRoute reads nearby meeting search params', () => {
  const route = parseRoute(
    '/meetings',
    '?searchMode=nearby&dayOfWeek=MONDAY&latitude=37.4979&longitude=127.0276&radiusKm=20',
  )

  assert.equal(route.name, 'meetings')
  assert.equal(route.searchMode, 'nearby')
  assert.equal(route.dayOfWeek, 'MONDAY')
  assert.equal(route.latitude, 37.4979)
  assert.equal(route.longitude, 127.0276)
  assert.equal(route.radiusKm, 20)
})

test('parseRoute keeps search metadata for public notice detail routes', () => {
  const route = parseRoute('/notices/12', '?themePreview=harbor')

  assert.equal(route.name, 'notices')
  assert.equal(route.noticeId, 12)
  assert.equal(route.search, '?themePreview=harbor')
})

test('parseRoute keeps search metadata for admin login routes', () => {
  const route = parseRoute('/admin/login', '?redirect=%2Fadmin%2Fgroups')

  assert.equal(route.name, 'admin-login')
  assert.equal(route.section, 'admin')
  assert.equal(route.search, '?redirect=%2Fadmin%2Fgroups')
  assert.equal(route.redirectPath, '/admin/groups')
})

test('parseRoute recognizes the public theme admin route', () => {
  const route = parseRoute('/admin/public-theme')

  assert.equal(route.name, 'admin-public-theme')
  assert.equal(route.section, 'admin')
})
