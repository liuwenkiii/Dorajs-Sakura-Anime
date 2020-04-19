const cheerio = require("cheerio")
const iconv = require("iconv-lite")

function weekdayNum2CN(weekday) {
    switch (weekday) {
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
        case 7:
            return '周日'
    }
}

module.exports = {
    type: "topTab",
    async fetch() {
        let response = await $http.get('http://www.imomoe.in', {
            responseType: 'arraybuffer'
        })
        const $ = cheerio.load(iconv.decode(response.data, 'gb2312'))

        let timeTable = []

        let weekdayItems = $('div.tists ul')
        weekdayItems.each((weekday, items) => {
            let list = $('li', items)
            let weekdayList = []

            list.each((_, item) => {
                let episode = $($('a', item)[0]).text()
                let id = $($('a', item)[0]).attr('href').split('/')[2].replace('.html', '')
                let title = $($('a', item)[1]).text().replace(/\s*/g, '')

                weekdayList.push({
                    style: 'simple',
                    title: title,
                    summary: episode,
                    route: $route('detail', {
                        id: id,
                        title: title
                    }),
                })
            })

            timeTable.push({
                title: weekdayNum2CN(weekday + 1),
                route: $route('@list', {
                    items: weekdayList
                })
            })
        })

        return timeTable
    }
}