let axios = require('axios')
let cheerio = require('cheerio')
let fs = require('fs')

let galardexUrl = 'https://wiki.52poke.com/zh-hans/%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%89%E4%BC%BD%E5%8B%92%E5%B0%94%E5%9B%BE%E9%89%B4%E7%BC%96%E5%8F%B7%EF%BC%89'

axios.get(galardexUrl)
	.then((response) => {
		if(response.status === 200) {
			var out = []
			var html = response.data
			let $ = cheerio.load(html)

			let dexTable = $('table.roundy.eplist.bgl-伽勒尔.bd-伽勒尔 tbody tr') //roundy eplist bgl-伽勒尔 bd-伽勒尔

			var regionHeader, nationHeader, nameHeader, typeHeader

			dexTable.each(function(i, elem) {
		 		let text = $(this).text().trim().replace('[[（属性）|]]', '').split(/\s+/)
				if (i == 0) {
					regionHeader = text[0]
					nationHeader = text[1]
					nameHeader = text[2]
					typeHeader = text[3]
				} else {
					out.push({
						[regionHeader] : text[0],
						[nationHeader] : text[1],
						[nameHeader] : text[2],
						[typeHeader] : text[4] == '' ? [text[3]] : [text[3], text[4]]
					})
				}
			})
			fs.writeFileSync("dex.json",JSON.stringify(out, null, 2))
		}

	}, (error) => {
		console.log("HTTP error: ", error)
	})