const cheerio = require("cheerio")
const iconv = require("iconv-lite")

/**
 * 以下函数用于生成视频链接
 * 是从混淆过的源码里摸出来的，眼睛都看花了
 */
function a(l111, l111l, videoListJson) {
  var x = videoListJson;
  if (x.length > 0) {
    x = x[Math.min(l111, x.length - 1)][1];
    return x[Math.min(l111l, x.length - 1)].split('$');
  } else {
    return ['', '', '']
  }
}

function b(f, l111) {
  var str1 = unescape("%u7B2C")
  var str2 = unescape("%u7EC4%u6765%u6E90%u4E2D%u7684%u6570%u636E");
  if (f[2] == "\u0079\u006f\u0075\u006b\u0075" || f[2] == "\u0069\u0061\u0073\u006b" || f[2] == "\u0074\u0075\u0064\u006f\u0075") {
    l1l11(f[1], f[2], play_vid, str1 + (parseInt(l111) + 1) + str2 + ':' + f[0] + '$' + f[1].replace(/&/g, '%26') + '$' + f[2])
  }
}

async function getUrl($, id, episode) {
  eval((await $http.get('http://www.imomoe.in' + $($('div.player script')[0]).attr('src'))).data.split(',urlinfo')[0])
  eval((await $http.get('https://data.video.iqiyi.com/v.mp4')).data)
  //console.log(VideoListJson)
  //console.log(videoUrl)

  let f = a('0', episode, VideoListJson)
  b(f, '0')

  let url = ''

  if (f[2].toLowerCase() == "dsssf") {
    url = f[1];
  } else {
    if (f[2] != "pm") {
      var cip = videoUrl["data"]["t"];
      var index = cip.indexOf('-');
      cip = cip.substr(0, index);
      var adr = cip.substr(cip.indexOf('|') + 1, cip.length)
      url = 'https://saas.jialingmm.net/code.php?type=' + f[2] + '&vid=' + f[1] + '&userlink=' + 'http://www.imomoe.in/player/' + id + '-0-' + episode + '.html' + '&adress=' + adr;
    }
  };
  //console.log(url)

  let response = await $http.get(url, {
    responseType: 'arraybuffer'
  })
  const $1 = cheerio.load(iconv.decode(response.data, 'gb2312'))

  let tvInfoJsUrl

  try {
    let tvInfoJsUrl = $1($1('script')[2]).attr('src')
    if (tvInfoJsUrl != undefined) {
      console.log(tvInfoJsUrl)
      let tvInfoJsStr = (await $http.get(tvInfoJsUrl)).data
      console.log(tvInfoJsStr)
      eval(tvInfoJsStr)
      console.log(tvInfoJs)

      ///////////////////////////////////////
      var cip = tvInfoJs["data"]["vidl"];
      //console.log(cip.length);
      for (var i = 0, l = cip.length; i < l; i++) {
        for (var key in cip[i]) {
          if (cip[i].vd == 14 || cip[i].vd == 17 || cip[i].vd == 21 || cip[i].vd == 1 || cip[i].vd == 96) {
          } else {
            //console.log(cip[i].vd);
            if (cip[i].vd == 4) {
              var m3u = cip[i].m3u;
            } else {
              var m3 = cip[i].m3u;
            }
          }
        }
      }
      var video = m3u;
      if (video == "undefined" || video == null || video == "") {
        video = m3;
      }
      //console.log(video);
      return video
    }
  } catch (e) {
    console.warn(e)
  }

  if (tvInfoJsUrl == undefined) {
    try {
      let scripts = $1('script')
      //console.log($1(scripts[2]).html())
      let video = $1(scripts[2]).html().split(';')[0].split('=')[1].replace('\'', '').replace('\'', '')
      //console.log(video)
      return video
    } catch (e) {
      console.warn(e)
    }
  }

  if (tvInfoJsUrl === undefined) {
    try {
      return $1($1('script')[3]).html().split('video =  \'')[1].split('\'')[0]
    } catch (e) {
      console.warn(e)
    }
  }

}

module.exports = {
  type: 'video',
  async fetch({ args }) {
    this.title = '第' + (args.episode + 1) + '话'
    let id = args.id
    let episode = args.episode

    let response = await $http.get('http://www.imomoe.in/player/' + id + '-0-' + episode + '.html', {
      responseType: 'arraybuffer'
    })
    const $ = cheerio.load(iconv.decode(response.data, 'gb2312'))

    let url = await getUrl($, id, episode)

    if (url == undefined) {
      $ui.alert('该资源已下架')
      this.finish()
    } else {
      $storage.put('lastPlayTitle', args.title)
      $storage.put('lastPlayEpisode', episode)
      $storage.put('lastPlayId', id)

      $storage.put(args.title + '-' + id, episode)
  
      return {
        url: url
      }
    }
  }
}