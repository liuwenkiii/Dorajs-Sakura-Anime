const cheerio = require("cheerio")
const iconv = require("iconv-lite")

module.exports = {
  type: 'list',
  async fetch({ args }) {
    this.title = args.title
    let id = args.id
    console.log(id)
    let response = await $http.get('http://www.imomoe.in/view/' + id + '.html', {
      responseType: 'arraybuffer'
    })
    const $ = cheerio.load(iconv.decode(response.data, 'gb2312'))

    let episodesList = $('div#play_0 li')

    let episodes = []

    episodesList.each((i, _) => {
      episodes.push({
        title: '第' + (i + 1) + '话',
        spanCount: 4,
        route: $route('player', {
          id: id,
          episode: i,
          title: args.title
        })
      })
    })

    return episodes
  }
}