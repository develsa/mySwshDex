let axios = require('axios')
let cheerio = require('cheerio')
let TableToJson = require('html-table-to-json')
let fs = require('fs')

let galardexUrl = 'https://wiki.52poke.com/zh-hans/%E5%AE%9D%E5%8F%AF%E6%A2%A6%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%89%E4%BC%BD%E5%8B%92%E5%B0%94%E5%9B%BE%E9%89%B4%E7%BC%96%E5%8F%B7%EF%BC%89'

axios.get(galardexUrl)
	.then((response) => {

		if(response.status === 200) {
			var html = response.data
			let $ = cheerio.load(html)

			let dexTable = $('table.roundy.eplist.bgl-伽勒尔.bd-伽勒尔') //roundy eplist bgl-伽勒尔 bd-伽勒尔

			let dex = new TableToJson(dexTable.toString())
			fs.writeFileSync("dex.json",JSON.stringify(dex.results[0], null, 2))
		}

	}, (error) => {
		console.log("HTTP error: ", error)	// Shouldn't be triggered ;)
	})