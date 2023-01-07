const request = require('request')
const cheerio = require('cheerio')

const scorecardObj = require('./scorecard')


function getAllMatchLink(uri) {
    request(uri, function (error, response, html) {
        if (error) {
            console.log(error)
        }
        else {
            extrackAllLink(html)
            //console.log(html)
        }
    })
}

function extrackAllLink(html) {
    let $ = cheerio.load(html)

    let scoreCardArr = $('div.ds-flex .ds-grow a.ds-no-tap-higlight')

    for (let i = 0; i < scoreCardArr.length; i++)    // get the scorecard of all the game
    {
        let link = $(scoreCardArr[i]).attr('href')
        let full_link = 'https://www.espncricinfo.com' + link
        // console.log(full_link)

        scorecardObj.ps(full_link)
         

    }

}


module.exports = {
    getAllMacth: getAllMatchLink
}