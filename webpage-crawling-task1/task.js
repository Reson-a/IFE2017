var webPage = require('webpage')
var system = require('system')
var url = 'https://www.baidu.com/s?wd='
var query = system.args[1]

console.log(query)

if (query === undefined) {
    console.log('Usage: task.js <some word>');
    phantom.exit();
}

var res = {}
var t = Date.now()

var page = webPage.create()

page.open(url + encodeURIComponent(query), function(s) {
    if (s !== 'success') {
        crawlingFailed()
    } else {
        var dataList = page.evaluate(function() {
            var dataList = []
            var results = document.getElementsByClassName('result')
            var l = results.length

            for (var i = 0; i < l; i++) {
                var item = results[i]
                var title = item.querySelector('.t>a')
                var info = item.querySelector('.c-abstract')
                var link = item.querySelector('.c-showurl')
                var pic = item.querySelector('.c-img')

                dataList.push({
                    title: title ? (title.textContent || '') : '',
                    info: info ? (info.textContent || '') : '',
                    link: link ? (link.textContent || '') : '',
                    pic: pic ? (pic.src || '') : ''
                })
            }

            return dataList
        })
        crawlingSuccessed()

        console.log(JSON.stringify(res, null, 4))
        phantom.exit()

        function crawlingFailed() {
            res.code = 0
            res.msg = '抓取失败'
            res.word = query
            res.time = Date.now() - t
            res.dataList = []
        }

        function crawlingSuccessed() {
            res.code = 1
            res.msg = '抓取成功'
            res.word = query
            res.time = Date.now() - t
            res.dataList = dataList
        }
    }
})