var events = {1939: ["Preliminary Steps"], 1940: ["Preliminary Steps"], 1941:["German Invasion of USSR"], 1942:["Start of the Program"], 1943:[], 1944:["Start of the Program"], 1945:["Picking Up the Pace"], 1946:["Making Progress"], 1947:[], 1948:[], 1949:["Getting Results"], 1950:["Espionage"], 1951:[], 1952:[], 1953:["Hydrogen Bomb"], 1954:[], 1955:[], 1956:[], 1957:["ICBM Test", "Sputnik 1"], 1958:[], 1959:[], 1960:[], 1961:["Missile Gap", "Tsar Bomba"], 1962:["Planning Missiles in Cuba", "Cuban Missile Crisis"], 1963:["Partial Test Ban Treaty"], 1964:["Dr. Strangelove Released"], 1965:[], 1966:[], 1967:[], 1968:["Non-Proliferation Treaty"], 1969:[], 1970:[], 1971:[], 1972:["SALT I"], 1973:[], 1974:["Threshold Test Ban Treaty (TTBT)"], 1975:[], 1976:[], 1977:[], 1978:[], 1979:["SALT II"], 1980:[], 1981:["Project RYaN"], 1982:[], 1983:[], 1984:[], 1985:[], 1986:[], 1987:["INF"], 1988:[], 1989:[], 1990:[], 1991:["START I", "Collapse of the Soviet Union"], 1992:[], 1993:[], 1994:[], 1995:[], 1996:[], 1997:[], 1998:[]}

document.addEventListener('click', function (event) {
	var clickedElement = event.target
    console.log("ce ")
    console.log(clickedElement)
    if(clickedElement.id == "info-box")
    {
        console.log(1)
        doFlip(clickedElement)
    }
    else if(clickedElement.id == "show-sources-instructions")
    {
        console.log(2)

        doFlip(clickedElement.parentElement)
    }
    else if(clickedElement.className == "dropdown-item")
    {
        var year = clickedElement.getAttribute("year")
        document.getElementById(year).scrollIntoView({behavior: 'smooth'})
        showInfoCard(year, clickedElement.innerHTML)
    }
    else if(clickedElement.id == "next-arrow")
    {
        var currentInfoCard = document.getElementById("info-box")
        document.getElementById("info-frame").setAttribute("data-cardtype", "info")
        document.getElementById("show-sources-instructions").innerHTML = "Click here to view sources"
        var currentYear = Number(clickedElement.getAttribute("year"))
        var itemNum = Number(clickedElement.getAttribute("item"))
        var haveNewEvent = false
        while (!haveNewEvent)
        {
            if (itemNum + 1 > events[currentYear].length - 1)
            {
                currentYear++
                itemNum = 0
                if(events[currentYear].length > 0)
                {
                    haveNewEvent = true
                }
            }
            else
            {
                itemNum++
                haveNewEvent = true 
            }
        }
        document.getElementById(currentYear).scrollIntoView({behavior: 'smooth'})
        showInfoCard(currentYear, events[currentYear][itemNum])
    }
    else if(clickedElement.id == "prev-arrow")
    {
        console.log("HERE")
        document.getElementById("info-frame").setAttribute("data-cardtype", "info")
        document.getElementById("show-sources-instructions").innerHTML = "Click here to view sources"
        var currentInfoCard = document.getElementById("info-box")
        var currentYear = Number(clickedElement.getAttribute("year"))
        var itemNum = Number(clickedElement.getAttribute("item"))
        var haveNewEvent = false
        while (!haveNewEvent)
        {
            console.log("year " + currentYear)
            console.log("num " + itemNum)

            console.log(events[currentYear].length)

            if (itemNum - 1 < 0)
            {
                currentYear--
                itemNum = events[currentYear].length - 1
                if(events[currentYear].length > 0)
                {
                    haveNewEvent = true
                }
            }
            else
            {
                itemNum--
                haveNewEvent = true 
            }
        }
        document.getElementById(currentYear).scrollIntoView({behavior: 'smooth'})
        showInfoCard(currentYear, events[currentYear][itemNum])
    }
    else
    {
        console.log("CLOSE")
        closeInfo(clickedElement)
    }
    
})

var wait = function(timeMS)
{
    return new Promise(
    function(resolve)
    {
        setTimeout(function(){resolve()}, timeMS);
    });
}

async function doFlip(element)
{
    var animationTimeMS = 1000

    // FLIP 1/2
    element.style.animationFillMode = "forwards"
    element.style.animationName = "flip1" 
    element.style.animationDuration = animationTimeMS / 2 + "ms"
    
    var x = await wait(animationTimeMS / 2)

    
    // CHANGE from info to source and vice versa
    console.log(element.children[0].getAttribute("data-cardtype"))
    console.log(element.children[0].getAttribute("data-cardtype") == "info")
    console.log("KSLDJFKLS")
    var currentFilePath = element.children[0].src
    if (element.children[0].getAttribute("data-cardtype") == "info")
    {
        element.children[0].outerHTML = '<iframe id="info-frame" data-cardtype="sources" id="content-0" src=' + currentFilePath.replace("info.html", "sources.html") + '></iframe>'
    }
    else
    {
        element.children[0].outerHTML = '<iframe id="info-frame" data-cardtype="info" id="content-0" src=' + currentFilePath.replace("sources.html", "info.html") + '></iframe>'
    }
    // FLIP other 1/2
    element.style.animationFillMode = "forwards"
    element.style.animationName = "flip2" 
    element.style.animationDuration = animationTimeMS / 2 + "ms"
    
    // swap instructions telling user to click to see info/sources
    if (document.getElementById("info-frame").getAttribute("data-cardtype") == "info")
    {
        document.getElementById("show-sources-instructions").innerHTML = "Click here to view sources"
    }
    else
    {
        document.getElementById("show-sources-instructions").innerHTML = "Click here to view info"
    }
    
    var x = await wait(animationTimeMS / 2 - animationTimeMS * .1)
    
    element.style.animationFillMode = ""
    element.style.animationName = "" 
    element.style.animationDuration = ""

}


function closeInfo(element)
{
    //make sure ALL of the graphs are hoverable
    var yearRows = document.getElementsByClassName("year-row")
    for(var i = 0; i < yearRows.length; i++)
    {
        yearRows[i].style.zIndex = ""
    }
    document.getElementById("info-box").style.display = "none"
}


function showInfoCard(year, event)
{
    var infoBox = document.getElementById("info-box")
    infoBox.style.display = "block"
    
    
    document.getElementById("info-frame").src= "information/" + year + "/" + event + "/info.html"
    
    var itemNum = null
    for(var ev in events)
    {
        for(var i = 0; i < events[ev].length; i++)
        {
            if (event == events[ev][i])
            {
                itemNum = i
            }
        }
    }
    document.getElementById("next-arrow").setAttribute("year", year)
    document.getElementById("next-arrow").setAttribute("item", itemNum)
    document.getElementById("prev-arrow").setAttribute("year", year)
    document.getElementById("prev-arrow").setAttribute("item", itemNum)

    //make sure none of the graphs are hoverable
    var yearRows = document.getElementsByClassName("year-row")
    for(var i = 0; i < yearRows.length; i++)
    {
        yearRows[i].style.zIndex = -100
    }
}


function makePage()
{
    for(var i = 1939; i <= 1998; i++)
    {
        var hasInfo = events[i].length > 0
        var yearRow = 
        "<div class='year-row' id='{YEAR}'>\
            <span href='javascript:void(0);' data-toggle='tooltip' data-html='true' data-placement='top' title='Number of Warheads<br>USSR: 0<br>US: 0' class='num-missiles graph'>&nbsp\
                <span class='USSR-graph' style='width:0%; z-index:{USSR-MISSILE-Z}; background-color:red; height:2em'></span>\
                <span class='US-graph' style='width:0%; z-index:{US-MISSILE-Z}; background-color:blue; height:2em'></span>\
            </span>\
            {0}\
            <span href='javascript:void(0);' data-toggle='tooltip' data-html='true' data-placement='top' title='Number of Tests<br>USSR: 0<br>US: 0' class='num-tests graph'>&nbsp\
                <span class='USSR-graph' style='width:0%; z-index:{USSR-TEST-Z}; background-color:red; height:2em'></span>\
                <span class='US-graph' style='width:0%; z-index:{US-TEST-Z}; background-color:blue; height:2em'></span>\
            </span>\
        </div>"
        
        if (hasInfo)
        {
            // add all the events from current year to the dropdown menu
            var dropDown = ""
            for (var d = 0; d < events[i].length; d++)
            {
                dropDown += "<a year='{YEAR}' class='dropdown-item' href='javascript:void(0);'>" + events[i][d] + "</a>"
            }            
            yearRow = yearRow.replace("{0}", "<span class='dropdown year-dropdown'>\
                <button type='button' class='btn dropdown-toggle bg-dark' data-toggle='dropdown' style='width:100%; height:2em; font-size:1em; color:white;'>\
                    {YEAR}\
                </button>\
                <div class='dropdown-menu'>{DROPDOWN}</div>\
            </span>")
            yearRow = yearRow.replace("{DROPDOWN}", dropDown)
        }
        else
        {            
            yearRow = yearRow.replace("{0}", '<span class="dropdown year-dropdown">\
                 <button type="button" class="btn dropdown-toggle" disabled style="color:grey;">{YEAR}</button>\
            </span>')
        }
        
        yearRow = yearRow.replace(/{YEAR}/g, i)
        yearRow += "<br><br>"
        
        document.getElementById("body").innerHTML += yearRow
    }
    // create the graphs
    readTextFile("data/num-missiles.csv")
    readTextFile("data/num-tests.csv")
}
makePage()