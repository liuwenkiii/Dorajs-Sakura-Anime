function buildItem(title, id, episode) {
    return {
        style: 'simple',
        title: title,
        summary: '看到第 ' + (episode + 1) + ' 话',
        route: $route('detail', {
            id: id,
            title: title
        }),
    }
}

module.exports = {
    type: "list",
    async fetch() {
        let items = []

        let collections = JSON.parse($storage.get('collections'))
        for (item in collections) {
            let title = item.get('title')
            let id = item.get('id')
            let episode = item.get('episode')
            items.push(buildItem(title, id, episode))
        }

        if (items.length == 0) {
            items.push({
                title: '暂无收藏',
                style: 'category',
                spanCount: 12
            })
        }

        return items
    }
}