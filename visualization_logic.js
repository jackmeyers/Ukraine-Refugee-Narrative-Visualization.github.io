const msToDay = 1000 * 60 * 60 * 24;

async function getData() {
    //local
    data = await d3.csv("https://jackmeyers.github.io/Ukraine-Refugee-Narrative-Visualization/public/border_traffic_UA_PL_01_03.csv");
    //github
    if (data === undefined){
        data = await d3.csv("public/border_traffic_UA_PL_01_03.csv");
    }
    return data;
}

async function init() {
    let data = await getData();
    getMaxNumberPeopleCheckedIn(data);
    createGraph(data);
    //testDateMath(data[10000]);
}

function getCheckedInBorderCrossingData(data, toPoland = true) {
    return data;
}

function createGraph(data) {
    console.log(data[0]);
    console.log("creating graph")

    var parseDate = d3.timeParse("%Y-%m-%d");
    var mindate = parseDate("2022-01-01"),
        maxdate = parseDate("2022-03-31");

    var x = d3.scaleTime()
        .domain([mindate, maxdate])
        .range([0, 500]);
    var y = d3.scaleLinear().domain([0, 5000]).range([500, 0]);

    d3.select("svg").append("g").attr("transform", "translate(50,50)")
        .selectAll("circle").data(data).enter().append("circle")
        .attr("cx", function (d) {
            return x(parseDate(d.Date));
        }).attr("cy", function (d) { return y(d.Number_of_persons_checked_in); })
        .attr("r", function (d) { return 2; });

    d3.select("svg").append("g").attr("transform", "translate(50,50)").call(d3.axisLeft(y).tickValues([100, 200, 500, 1000]).tickFormat(d3.format("d")));
    d3.select("svg").append("g").attr("transform", "translate(50,550)").call(d3.axisBottom(x).tickValues([10, 20, 50, 90]).tickFormat(d3.format("d")));
}

////////////////////////////////////////////////////////////////
//Utitlities / Tests
////////////////////////////////////////////////////////////////
function testDateMath(entry) {
    console.log("Entry: " + entry.Date.toString());
    console.log("DaysFromBeginning: " + getDaysFromBeginning(entry));
}

function getMaxNumberPeopleCheckedIn(data) {
    let max = 0;
    for (entry of data) {
        if (entry.Number_of_persons_checked_in > max)
            max = entry.Number_of_persons_checked_in;
    }
    console.log(max);
}

function getDaysFromBeginning(value) {
    console.log(value);
    var start = new Date("2022-01-01");
    var current = new Date(value.Date);
    var diff = (current - start) / msToDay;
    return diff;
}