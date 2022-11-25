import React from 'react'
import ReactDOMServer from 'react-dom/server'
import express from 'express'
import mysql from 'mysql2/promise'
import * as uuid from 'uuid'
import * as path from 'path'

// 服务配置
const ENV = {
  BASE_URL: process.env.BASE_URL || 'http://192.192.192.6:8000',
  MYSQL_HOST: process.env.MYSQL_HOST || '192.192.192.6',
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'root',
  SUGAR_BASE_URL: process.env.SUGAR_BASE_URL || 'http://192.192.192.6:8580'
}

// 数据库连接池
const pool = mysql.createPool({
  host: ENV.MYSQL_HOST,
  port: ENV.MYSQL_PORT,
  user: ENV.MYSQL_USERNAME,
  password: ENV.MYSQL_PASSWORD
})

// 缓存
const cache = new Map()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

const HTML = props => (
  <html>
    <head>
      <title>Sugar Token Login Adapter</title>
    </head>
    <body>
      <table border={1} cellSpacing={0} cellPadding={0} style={{ width: '1000px', margin: 'auto' }}>
        <thead>
          <tr>
            <th style={{ width: '200px' }}>员工编码</th>
            <th style={{ width: '200px' }}>员工姓名</th>
            <th style={{ width: '200px' }}>Sugar BI 邮箱</th>
            <th style={{ width: '200px' }}>Sugar BI 昵称</th>
            <th style={{ width: '200px' }} />
          </tr>
        </thead>
        <tbody>
          {props.rows.map(it => (
            <tr key={it.employee_code}>
              <td>
                <code>{it.employee_code}</code>
              </td>
              <td>
                <code>{it.employee_name}</code>
              </td>
              <td>
                <code>{it.sugar_email}</code>
              </td>
              <td>
                <code>{it.sugar_nickname}</code>
              </td>
              <td>
                <a href={`${ENV.BASE_URL}/sugar?user=${it.employee_code}`} target="_blank">
                  GO
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </body>
  </html>
)

// 测试接口
app.get('/', async (req, res, next) => {
  const [rows, fields] = await pool.query(`SELECT employee_code, employee_name, sugar_email, sugar_nickname FROM dim.dim_permission`)
  const html = ReactDOMServer.renderToString(<HTML rows={rows} />)
  res.send(html)
})

// 登录回调接口
app.get('/sugar', async (req, res, next) => {
  try {
    const { user, url } = req.query
    const [rows, fields] = await pool.query(`SELECT sugar_email as email, sugar_nickname as name FROM dim.dim_permission WHERE employee_code = ? LIMIT 1`, [user])
    if (rows.length === 1) {
      // 生成 token
      const token = uuid.v4()
      const { email, name } = rows[0]
      cache.set(token, { email, name })
      console.log(`[/sugar] token=${token} email=${email} name=${name}`)
      // 回调 sugar
      let redirectUrl = `${ENV.SUGAR_BASE_URL}/login/tokenLoginCallback?token=${token}`
      if (url) {
        redirectUrl = `${redirectUrl}&url=${url}`
      }
      res.redirect(redirectUrl)
    } else {
      res.status(401).json({ code: '401', message: '登录失败' })
    }
  } catch (e) {
    console.log(e)
    res.status(503).json({ code: '503', message: '服务暂时无法访问' })
  }
})

// 用户信息接口
app.get('/user-info', (req, res, next) => {
  const { token } = req.query
  const { email, name } = cache.get(token)
  cache.delete(token)
  console.log(`[/user-info] token=${token} email=${email} name=${name}`)
  res.json({ name, email })
})

app.listen(8000, () => console.log(`Listening on :8000`))
