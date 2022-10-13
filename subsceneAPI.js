const got = require("got-scraping").gotScraping,
cheerio = require("cheerio"),
config = require('./config'),
baseUrl = config.BaseURL,
unzip = require("adm-zip");

async function search(query = String) {
  try {
    if (!query.length)throw "Query Is Null"
    var res = await got.post(baseUrl+"/subtitles/searchbytitle", {
      json: {
        query
      },retry:{limit:5, methods:["GET","POST"]}})
    if (!res||!res.body)throw "No Response Found"
    let $ = cheerio.load(res.body)
    let results = []
    $(".search-result ul a").map((i, el)=> {
      if (el.attribs && el.attribs.href && el.children && el.children[0] && el.children[0].data) {
        var data = {
          path: el.attribs.href,
          title: el.children[0].data
        }
        results.push(data)
      }
    })
    results = filterItOut(results)
    return results || null
  }catch(e) {
    console.log(e);
    throw e
  }
}

function filterItOut(res) {
  let results = []
  for (let i in res) {
    if (!results.length || results.findIndex(x=>x.path == res[i].path)===-1) {
      results.push(res[i])
    }
  }
  return results
}

async function subtitle(url = String) {
  try {
    if (!url.length) throw "Path Not Specified"
    var res = await got.get(baseUrl+url,{retry:{limit:5}})
    if (!res||!res.body)throw "No Response Found"
    var $ = cheerio.load(res.body)
    let results = []
    $("table tr .a1 a").map((i, e)=> {
      if (e.attribs && e.attribs.href) {
        var url = e.attribs.href,
        title,
        lang
        e.children.map((e2, j)=> {
          try {
            if (e2.type === "tag" && e2.name === "span") {

              if (!lang)lang = e2.children[0].data.replace(/\t|\n|\r/g, "")
              else title = e2.children[0].data.replace(/\t|\n|\r/g, "")
            }
          }catch(err) {
            lang = "notSp",
            title = "no Title Found"
          }
        })
        results.push({
          path: url,
          title: title || "no title found",
          lang: lang || "notSp"
        })
      }
    })
    results = sortByLang(results)
    return results || null
  } catch (e) {
    throw e
  }
}

function sortByLang(subs = Array) {
  try {
    let sorted = {}
    subs.map((e,
      i)=> {
      if (sorted[e.lang.toLowerCase()]) {
        sorted[e.lang.toLowerCase()].push(e)
      } else {
        sorted[e.lang.toLowerCase()] = [e]
      }
    })
    return sorted
  }catch(err) {
    return null
  }
}

async function download(url = String) {
  try {
    let res = await got.get(baseUrl+url,{retry:{limit:5}})
    if (!res||!res.body)throw "No Data Found"
    let $ = cheerio.load(res.body),
    downUrl
    $("#downloadButton").map((i, e)=> {
      downUrl = e.attribs.href
    })
    if (!downUrl)throw "Unexpected Error"
    res = await got.get(baseUrl+downUrl, {
      responseType: "buffer"
    })
    if (!res||!res.body)throw "File Downloading Error"
    return res.body
  } catch (e) {
    throw e
  }
}

module.exports.search = search
module.exports.getSubtitles = subtitle
module.exports.download = download