// 我们最好把所有的引包都放到代码文件的最上面
const express = require('express')
const expressArtTemplate = require('express-art-template') // 模板引擎
const comment = require('./comment') // 操作 db.json 文件
const bodyParser = require('body-parser') // 作用：解析表单 POST 请求体数据

const app = express()

// 把 node_modules 开放出来
app.use('/node_modules/', express.static('./node_modules/'))

// 配置使用 art-template 模板引擎
app.engine('html', expressArtTemplate)


// 配置使用 body-parser 插件
// 该插件会把请求体数据解析到 req.body 中
// 也就是我们可以直接在后面的请求处理方法中通过访问 req.body 来获取表单 post 请求体数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  comment.findAll((err, comments) => {
    if (err) {
      return console.log('读取数据失败')
    }
    res.render('index.html', {
      // EcmaScript 6 简写方式
      // 等价于 comments: comments
      comments
    })
  })
})

app.get('/fabiao', (req, res) => {
  res.render('fabiao.html')
})

app.post('/fabiao', (req, res) => {
  // 1. 接收表单 post 提交的数据
  // 2. 验证
  // 3. 持久化存储
  // 4. 发送响应
  const body = req.body
  
  if (!body.name || !body.name.length) {
    return res.send('name invalid')
  }
  if (!body.content || !body.content.length) {
    return res.send('content invalid')
  }

  comment.save(body, err => {
    if (err) {
      return res.send('500 Server Error')
    }
    // Express 为 res 提供了一个 redirect 方法可以试想重定向
    // 重定向会自动结束响应
    res.redirect('/')
  })
})

app.listen(3000, () => {
  console.log('app running...')
})
