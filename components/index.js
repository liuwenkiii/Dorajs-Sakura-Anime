module.exports = {
  type: 'bottomTab',
  title: '樱花动漫',
  searchRoute: $route('search'),
  async fetch({ args, page }) {
    // 获取启动页设置
    //let launchPage = $prefs.get('launchPage')

    let browse = {
      title: '浏览',
      route: $route('browse'),
      image: $icon('dashboard')
    }

    /*
    let collection = {
      title: '收藏',
      route: $route('collection'),
      image: $icon('grade')
    }
    */

    let timetable = {
      title: '追番表',
      route: $route('timetable'),
      image: $icon('schedule')
    }


    return [browse, timetable]

    /*
    if (launchPage == 'browse') {
      return [browse, collection, setting]
    } else if (launchPage == 'collection') {
      return [collection, browse, setting]
    }
    */
    
  }
}
