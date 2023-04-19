const got = require("got-scraping").gotScraping,
cheerio = require("cheerio"),
config = require('./config'),
baseUrl = config.BaseURL,
unzip = require("adm-zip"),
{ parse } = require("node-html-parser");

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
/*
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
*/

async function subtitle(url = String) {
  try {
    console.log(url)
    if (!url.length) throw "Path Not Specified"
    var res = await got.get(baseUrl+url,{retry:{limit:5}})
    if (!res||!res.body)throw "No Response Found"
    if (res.body.includes("To many request")) throw "Too Many Request";
    let results = []
    let body = parse(res.body)
    let imdb_id = res.body.split("href=\"https://www.imdb.com/title/")[1].split("\">Imdb</a>")[0];
    let year = body.querySelector("#content > div.subtitles.byFilm > div.box.clearfix > div.top.left > div > ul > li:nth-child(1)").innerHTML.match(/[0-9]+/gi)[0];// alternative if dont want to always repeat search with year
    let table = body.querySelectorAll('table tbody tr')
    for (let i = 0;i<table.length;i++){
      let row = table[i];
      if(row.childNodes.length>3){
        let e = row.querySelector("td a")
        let url = e.rawAttributes["href"]
        let lang = e.querySelectorAll("span")[0].rawText.replace(/\t|\n|\r/g, "")
        let title = e.querySelectorAll("span")[1].rawText.replace(/\t|\n|\r/g, "")
        let hi = row.querySelector("td.a41")?true:false;
        let comment = row.querySelector('td.a6 div').rawText.replace(/\t|\n|\r/g, "")
        let sdh = (comment.toLowerCase().includes("sdh") &&!(comment.toLowerCase().includes("no sdh")||comment.toLowerCase().includes("sdh removed")))?true:false
        results.push({
          path: url,
          title: title || "no title found",
          lang: lang || "notSp",
          hi: hi,
          sdh: sdh,
          imdb_id : imdb_id,
          year : year // bring it to front
        })
      }
    } 
    //results = sortByLang(results) // sort happen after this function
      //console.log("results",results["english"])
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
  
  async function downloadUrl(url = String) {
    try {
      let res = await got.get(url,{retry:{limit:5}})
      if (!res||!res.body)throw "No Data Found"
      let $ = cheerio.load(res.body),
      downUrl
      $("#downloadButton").map((i, e)=> {
        downUrl = e.attribs.href
      })
      if (!downUrl)throw "Unexpected Error"
      return baseUrl + downUrl;
  
    } catch (e) {
      throw e
    }
  }

module.exports.search = search
module.exports.getSubtitles = subtitle
module.exports.downloadUrl = downloadUrl
module.exports.sortByLang = sortByLang;