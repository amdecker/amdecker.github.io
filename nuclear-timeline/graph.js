var firstYear   = 1945
var lastYear    = 1998
var maxMissiles = 0
var maxTests    = 0

/*for(var i = 1939; i < 1945; i++)
    {
        var hasInfo = events[i].length > 0
        var yearRow = 
        "<div class='year-row' id='" + i + "'>\
            <span class='num-missiles'>\
                <span class='USSR-graph'></span>\
                <span class='US-graph'></span>\
            </span>\
            {0}\
            <span class='num-tests'>\
                <span class='USSR-graph'></span>\
                <span class='US-graph'></span>\
            </span>\
        </div>"*/
// the data is from https://ourworldindata.org/nuclear-weapons
function readTextFile(file) 
/* reads all the data from the text file and changes the widths of the spans to show the data */
{
    var rawFile = new XMLHttpRequest();
    
    rawFile.open("GET", file, false);
    
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) 
            {
                console.log("FILE: " + file)
                var allText = rawFile.responseText;
                var rows = allText.split("\n")
                rows.shift() // remove the first item that has the column names
                var onlyUS = []
                var onlyUSSR = []
                for (var r = 0; r < rows.length; r++)
                {
                    var colSplit = rows[r].split(",")
                    colSplit[3] = Number(colSplit[3])
                    
                    // find the highest number of missiles/tests among the US and USSR
                    if (colSplit[0] == "United States" || colSplit[0] == "Russia")
                    {
                        if (file == "data/num-missiles.csv")
                        {
                            if (colSplit[3] > maxMissiles)
                            {
                                maxMissiles = colSplit[3]
                            }
                        }
                        else if (file == "data/num-tests.csv")
                        {
                            if (colSplit[3] > maxTests)
                            {
                                maxTests = colSplit[3]
                            }
                        }
                    }
                    
                    // add data to US and USSR arrays
                    if (colSplit[0] == "United States")
                    {
                        onlyUS.push(colSplit)
                    }
                    else if(colSplit[0] == "Russia")
                    {
                        onlyUSSR.push(colSplit)
                    }
                }
                for(var i = 0; i < onlyUS.length; i++)
                {
                    var yearString = onlyUS[i][2] // gets the year
                    var yearNum = Number(yearString)
                    if (yearNum >= firstYear && yearNum <= lastYear) // make sure there is data for that year
                    {
                        if (file == "data/num-missiles.csv")
                        {
                            var numMissilesElement = document.getElementById(yearString).children[0]
                            var ussrMissiles = numMissilesElement.children[0]
                            var usMissiles = numMissilesElement.children[1]

                            // set the widths of the divs as a percentage of max value for each
                            ussrMissiles.style.width = onlyUSSR[i][3] / maxMissiles * 100+ "%"
                            usMissiles.style.width = onlyUS[i][3] / maxMissiles * 100 + "%"
                            

                            // set hover text
                            numMissilesElement.title = "Number of Warheads<br>USSR: " + onlyUSSR[i][3].toLocaleString() + "<br>US: " + onlyUS[i][3].toLocaleString() // .toLocaleString() adds commas to the numbers
                            
                            // make sure the smaller one is on top so that it is visible
                            if(onlyUSSR[i][3] > onlyUS[i][3])
                            {
                                var ussrMissiles = document.getElementById(yearString).children[0].children[0].style.zIndex = -2
                                var usMissiles = document.getElementById(yearString).children[0].children[1].style.zIndex = -1
                            }
                            else
                            {
                                var ussrMissiles = document.getElementById(yearString).children[0].children[0].style.zIndex = -1
                                var usMissiles = document.getElementById(yearString).children[0].children[1].style.zIndex = -2
                            }
                        }
                        else if (file == "data/num-tests.csv")
                        {
                            var numTestsElement = document.getElementById(yearString).children[2]
                            var ussrTests = numTestsElement.children[0]
                            var usTests = numTestsElement.children[1]
                            ussrTests.style.width = onlyUSSR[i][3] / maxTests * 100 + "%"
                            usTests.style.width = onlyUS[i][3] / maxTests * 100 + "%"
                            
                            numTestsElement.title = "Number of Nuclear Tests<br>USSR: " + onlyUSSR[i][3].toLocaleString() + "<br>US: " + onlyUS[i][3].toLocaleString()
                            // make sure the smaller one is on top so that it is visible
                            if(onlyUSSR[i][3] > onlyUS[i][3])
                            {
                                var ussrTests = document.getElementById(yearString).children[2].children[0].style.zIndex = -2
                                var usTests = document.getElementById(yearString).children[2].children[1].style.zIndex = -1
                            }
                            else
                            {
                                var ussrTests = document.getElementById(yearString).children[2].children[0].style.zIndex = -1
                                var usTests = document.getElementById(yearString).children[2].children[1].style.zIndex = -2
                            }                        
                        }
                    }
                }
            }
        }
    }
    rawFile.send(null);
}


//function makePage()
///* Creates the spans that are used for the graph and calls function that gets data and makes the spans the right length */
//{
//    for(var i = firstYear; i <= lastYear; i++)
//    {
//        var yearRow = 
//        "<div class='year-row' id='{YEAR}'>\
//            <span href='#' data-toggle='tooltip' data-html='true' data-placement='top' title='BOMBS' class='num-missiles graph'>&nbsp\
//                <span class='USSR-graph' style='width:{USSR-MISSILE-WIDTH}; z-index:{USSR-MISSILE-Z}; background-color:red; height:2em'></span>\
//                <span class='US-graph' style='width:{US-MISSILE-WIDTH}; z-index:{US-MISSILE-Z}; background-color:blue; height:2em'></span>\
//            </span>\
//            <span class='horizontal-center' style='height:1em;'>{YEAR}</span>\
//            <span href='#' data-toggle='tooltip' data-html='true' data-placement='top' title='TESTS' class='num-tests graph'>&nbsp\
//                <span class='USSR-graph' style='width:{USSR-TEST-WIDTH}; z-index:{USSR-TEST-Z}; background-color:red; height:2em'></span>\
//                <span class='US-graph' style='width:{US-TEST-WIDTH}; z-index:{US-TEST-Z}; background-color:blue; height:2em'></span>\
//            </span>\
//        </div>"
//
//        yearRow = yearRow.replace(/{YEAR}/g, i) // replaces all instances of {YEAR} not just one
//        yearRow += "<br><br>"
//        
//        document.getElementById("body").innerHTML += yearRow
//    }
//    // create the graphs
//    readTextFile("data/num-missiles.csv")
//    readTextFile("data/num-tests.csv")
//}
//makePage()