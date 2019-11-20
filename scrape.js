let axios = require('axios')
let cheerio = require('cheerio')
let fs = require('fs')
let loop = require('for-async')

let baseUrl = 'https://wiki.52poke.com/zh-hans/'
let galardexUrl = baseUrl + '%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%89%E4%BC%BD%E5%8B%92%E5%B0%94%E5%9B%BE%E9%89%B4%E7%BC%96%E5%8F%B7%EF%BC%89'
let emptyType = '[[（属性）|]]'
let galarForm = '伽勒尔的样子'
let alolaForm = '阿罗拉的样子'
let galar = '伽勒尔'

axios.get(galardexUrl)
	.then((response) => {
		if(response.status === 200) {
			var out = []
			var $ = cheerio.load(response.data)

			let dexTable = $('table.roundy.eplist.bgl-伽勒尔.bd-伽勒尔 tbody tr') //roundy eplist bgl-伽勒尔 bd-伽勒尔

			dexTable.slice(1).each(function(i, elem) {
		 		let text = $(this).text().trim().replace(galarForm, '[g]').replace(galar, ' ').split(/\s+/)
				out.push({
					regionDex : text[0],
					nationDex : text[1],
					name : text[2],
					type : text[4] == emptyType ? [text[3]] : [text[3], text[4]],
					family : []
				})
			})

			var promises = []
			loop(out, function(item, idx) {
				promises.push(axios.get(encodeURI(baseUrl + item.name.replace('[g]', '')))
					.then((response) => {
						if(response.status === 200) {
							$ = cheerio.load(response.data)
							$('table.a-c.at-c.roundy tbody tr td table.roundy.at-c.a-c tbody tr td.textblack span').remove()
							let evolveLineTable = $('table.a-c.at-c.roundy tbody tr td table.roundy.at-c.a-c tbody tr td.textblack')
							item.family = evolveLineTable.text().trim().replace(new RegExp(galarForm,'g'), '[g]').replace(new RegExp(alolaForm,'g'), '[a]').split(/\s+/)
						}

					}, (error) => {
						console.log("HTTP error: ", error)
					})
				)
			})
			.then(() => {
				Promise.all(promises)
					.then(() => {
						fs.writeFileSync("dex.json",JSON.stringify(out, null, 2))
					})
			})
			//fs.writeFileSync("dexShort.json",JSON.stringify(out, null, 2))
		}

	}, (error) => {
		console.log("HTTP error: ", error)
	})