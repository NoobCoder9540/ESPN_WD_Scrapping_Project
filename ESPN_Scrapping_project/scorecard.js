const cheerio = require('cheerio')
const request = require('request')
const path = require('path')
const fs = require('fs')
const xlsx = require('xlsx')

// const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-sunrisers-hyderabad-qualifier-2-1237180/full-scorecard'

function processScoreCard(url) {
    request(url, cb)
}


function cb(error, response, html) {
    if (error) {
        console.log(error)
    }
    else {

        extractMatchDetails(html)
    }
}

function extractMatchDetails(html) {
    let $ = cheerio.load(html)
    let description = $('div.ds-text-tight-m.ds-text-ui-typo-mid')
    // console.log(description.text())

    let descriptionstring = description.text().split(',')

    // console.log(descriptionstring)

    let venue = descriptionstring[1].trim()
    console.log(venue)

    let date = descriptionstring[2].trim() + " " + descriptionstring[3].trim()
    console.log(date)

    let result = $('.ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title')
    console.log(result.text())


    let inning = $('.ds-rounded-lg.ds-mt-2 .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4')

    let htmlString = ''

    for (let i = 0; i < inning.length; i++) {
        htmlString += $(inning[i]).html()

        //find function from cheerio
        let teamname = $(inning[i]).find('.ds-text-title-xs.ds-font-bold.ds-text-typo-title .ds-capitalize').text()

        let opponenetIndex = i == 0 ? 1 : 0

        let opponentName = $(inning[opponenetIndex]).find('.ds-text-title-xs.ds-font-bold.ds-text-typo-title .ds-capitalize').text()


        // console.log(teamname,opponentName)

        let currInning = $(inning[i])
        let allrows = currInning.find('.ci-scorecard-table tbody tr')

        for (let j = 0; j < allrows.length; j++) {
            let allcol = $(allrows[j]).find('td')

            let isWorthy = $(allcol[0]).hasClass('ds-w-0 ds-whitespace-nowrap ds-min-w-max')


            if (isWorthy == true) {
                let playerName = $(allcol[0]).text().trim()

                let runs = $(allcol[2]).text().trim()
                let balls = $(allcol[3]).text().trim()
                let fours = $(allcol[5]).text().trim()
                let sixes = $(allcol[6]).text().trim()
                let STR = $(allcol[7]).text().trim()

                console.log(`${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${STR}`)  //templete literal

                processPlayer(teamname, opponentName, playerName, runs, balls, fours, sixes, STR, venue, date, result.text())

            }

        }
        //console.log('----------------------------------------------')


    }

    // console.log(htmlString)

}

function processPlayer(teamname, opponentName, playerName, runs, balls, fours, sixes, STR, venue, date, result) {

    let teamPath = path.join(__dirname,"IPL",teamname)

    dirCreator(teamPath)

    let filePath = path.join(teamPath,playerName+'.xlsx')
    let content = excelReader(filePath,playerName)

    let playerObj = 
    {
        "teamName" : teamname,
        "opponentName" : opponentName,
        "playerName" : playerName,
        "runs" : runs,
        "balls" : balls,
        "fours" : fours,
        "sixes" : sixes,
        "STR" : STR,
        "venue" : venue,
        "data" : date,
        "result" : result
    };

    content.push(playerObj)

    excelWriter(filePath,playerName,content)

}

function dirCreator(folderPath) {
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath)
    }
}

function excelWriter(fileName, sheetName, jsonData) {
    //JSON to excel
    let newWB = xlsx.utils.book_new()      //Creating a new WorkBook
    let newWS = xlsx.utils.json_to_sheet(jsonData)  // Json is converted to sheet format
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName)  //
    xlsx.writeFile(newWB, fileName)
}


function excelReader(fileName,sheetname)
{
    if(fs.existsSync(fileName)==false)
    {
        return []
    }
//excel to json
let wb = xlsx.readFile(fileName)
let excelData = wb.Sheets[sheetname]
let ans = xlsx.utils.sheet_to_json(excelData)
return ans
}


module.exports = {
    ps: processScoreCard
}
