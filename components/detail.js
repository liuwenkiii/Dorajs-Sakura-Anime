const cheerio = require("cheerio")
const iconv = require("iconv-lite")

module.exports = {
  type: 'list',
  async fetch({ args }) {
    this.allowBookmark = true
    this.title = args.title
    let id = args.id
    console.log(id)
    let response = await $http.get('http://www.imomoe.in/view/' + id + '.html', {
      responseType: 'arraybuffer'
    })
    const $ = cheerio.load(iconv.decode(response.data, 'gb2312'))

    let episodesList = $('div#play_0 li')

    let info = $('div.info')

    let items = []

    items.push({
      title: '简介',
      style: 'category',
      spanCount: 12
    })

    items.push({
      style: 'simple',
      title: $(info[0]).text(),
    })

    items.push({
      title: '选集',
      style: 'category',
      spanCount: 12
    })

    let lastEpisode = -1
    if ($storage.has(args.title + '-' + id))
      lastEpisode = $storage.get(args.title + '-' + id)

    episodesList.each((i, _) => {
      let t = '第 ' + (i + 1) + ' 话'
      if (i == lastEpisode) {
        t = '* ' + t
      }
      items.push({
        title: t,
        spanCount: 4,
        style: 'label',
        route: $route('player', {
          id: id,
          episode: i,
          title: args.title
        })
      })
    })

    return items
  }
}