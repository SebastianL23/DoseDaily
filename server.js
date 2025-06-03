const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Debug environment variables
console.log('Environment Variables Check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('COINBASE_WEBHOOK_SECRET exists:', !!process.env.COINBASE_WEBHOOK_SECRET)
console.log('Available env keys:', Object.keys(process.env))

// Use port 8080 for Railway, 3000 for local development
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3000
// Use '0.0.0.0' for production to allow external connections
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port, host, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${host}:${port}`)
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}) 