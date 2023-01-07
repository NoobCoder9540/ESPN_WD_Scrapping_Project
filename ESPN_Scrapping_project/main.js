const cheerio = require('cheerio')

const request = require('request')

const fs = require('fs')


const path = require('path')

let iplpath = path.join(__dirname, "IPL")

dirCreator(iplpath)

const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595'

const allMatchObj = require('./allMatch')



request(url, cb)

function cb(error, response, html) {
    if (error) {
        console.log(error)
    }
    else {
        // console.log(html)
        extractlink(html)
    }
}


function extractlink(html) {
    let $ = cheerio.load(html)
    let anchorElem = $('.ds-block .ds-border-t a.ds-inline-flex')

    let link = anchorElem.attr('href')

    //    console.log(link)

    let full_link = 'https://www.espncricinfo.com' + link
    // console.log(full_link)

    allMatchObj.getAllMacth(full_link)
}



function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }
}


