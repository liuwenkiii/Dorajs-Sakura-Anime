const cheerio = require("cheerio")
const iconv = require("iconv-lite")

function lastPlay() {
    if ($storage.has('lastPlayTitle')) {
        let title = $storage.get('lastPlayTitle')
        let episode = $storage.get('lastPlayEpisode')
        let id = $storage.get('lastPlayId')
        return {
            style: 'simple',
            title: title,
            summary: '看到第 ' + (episode + 1) + ' 话',
            route: $route('detail', {
                id: id,
                title: title
            }),
        }
    } else {
        return {
            style: 'simple',
            title: "暂无播放记录"
        }
    }
}

module.exports = {
    type: 'list',
    activated() {
        if (this.shouldRefresh != undefined && this.shouldRefresh) {
            this.refresh()
            this.shouldRefresh = false
        }
    },
    inactivated() {
        this.shouldRefresh = true
    },
    async fetch() {
        let response = await $http.get('http://www.imomoe.in', {
            responseType: 'arraybuffer'
        })
        const $ = cheerio.load(iconv.decode(response.data, 'gb2312'))

        let items = []

        // 上次播放
        items.push({
            title: '上次播放',
            style: 'category'
        })
        items.push(lastPlay())

        let categories = ['最近更新', '日本动漫', '国产动漫', '欧美动漫', '动漫电影']

        for (let i = 0; i < 5; i++) {
            items.push({
                title: categories[i],
                style: 'category'
            })
            let list = $('div.imgs')[i]
            let categoryItems = $('li', list)
            categoryItems.each((_, item) => {
                let episode = $($('p', item)[1]).text()
                let title = $('p a', item).text().replace(/\s*/g, '')
                let img = $('a img', item).attr('src')
                let id = $('a', item).attr('href').split('/')[2].replace('.html', '')

                items.push({
                    style: 'live',
                    title: episode,
                    image: img,
                    author: {
                        name: title
                    },
                    route: $route('detail', {
                        id: id,
                        title: title
                    })
                })
            })
        }

        return items
    }

}