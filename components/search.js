const cheerio = require("cheerio")
const iconv = require("iconv-lite")

function getItems($) {
    let list = $('div.pics li')
    let items = []
    list.each((_, it) => {
        let img = $('a img', it).attr('src')
        let title = $('h2 a', it).text()
        let id = $('h2 a', it).attr('href').split('/')[2].replace('.html', '')
        let episode = $($('span', it)[1]).text().split('类型')[0].replace(' ', '')
        //episode = episode.search('全') == -1 ? (episode != '全' ? ('第 ' + episode + ' 话') : '第 1 话') : (episode.replace('全', '') == '' ? '已完结' : episode.replace('全', '') + ' 话 ｜ 已完结')
        items.push({
            style: 'live',
            title: episode.replace('期', ''),
            image: img,
            spanCount: 6,
            author: {
                name: title
            },
            route: $route('detail', {
                id: id,
                title: title
            })
        })
    })
    return items
}

function getMaxPage($) {
    let pages = $('div.pages')
    return Number($(pages[0]).text().split('/')[1].replace('页'))
}

function encodeURIComponent_GBK(str) {
    if (str == null || typeof (str) == 'undefined' || str == '')
        return '';

    var a = str.toString().split('');

    for (var i = 0; i < a.length; i++) {
        var ai = a[i];
        if ((ai >= '0' && ai <= '9') || (ai >= 'A' && ai <= 'Z') || (ai >= 'a' && ai <= 'z') || ai === '.' || ai === '-' || ai === '_') continue;
        var b = iconv.encode(ai, 'gb2312');
        var e = [''];
        for (var j = 0; j < b.length; j++)
            e.push(b.toString('hex', j, j + 1).toUpperCase());
        a[i] = e.join('%');
    }
    return a.join('');
}


module.exports = {
    type: "list",
    async fetch({ args, page }) {
        console.log(this.isFirst)
        if (page == null && this.isFirst == undefined) {
            page = 1
            this.isFirst = false
        }
        if (page == null && !this.isFirst) {
            $ui.toast('无更多结果')
        } else if (page != null && !this.isFirst) {
            console.log('page = ' + page)
            if (args.keyword != '' && page != null) {
                let keyword = args.keyword
                let response = await $http.get('http://www.imomoe.in/search.asp?page=' + page + '&searchword=' + encodeURIComponent_GBK(keyword) + '&searchtype=-1', {
                    responseType: 'arraybuffer'
                })
                const $ = cheerio.load(iconv.decode(response.data, 'gb2312'))
                let items = getItems($)
                let maxPage
                try {
                    maxPage = getMaxPage($)
                } catch (e) { }
                console.log('max' + maxPage)
                if (maxPage == undefined) {
                    $ui.alert('无结果')
                    this.finish()
                } else if (isNaN(maxPage)) {
                    console.log('is NaN')
                    $ui.toast('无更多结果')
                    if (page == 1) {
                        return {
                            nextPage: null,
                            items: items
                        }
                    }
                } else {
                    return {
                        nextPage: page >= maxPage ? null : page + 1,
                        items: items
                    }
                }
            }
        } else {
            $ui.alert('没有更多数据了')
            console.log('end')
        }

    }
}