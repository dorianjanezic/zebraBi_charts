const sales = 'This Year Sales'
const this_year_sales = []


//getting the data
d3.csv("/Multiples.csv").then(function(data) {

    //grouping data by district
    entries = d3.group(data, d => d.District)
    console.log(entries);


    let fd01 = (entries.get("FD - 01"));
    for (var i = 0; i < fd01.length; i++) {
        console.log(fd01[i]);
        // this_year_sales.push(parseInt(fd01[sales].slice(1)))

    }
    console.log(this_year_sales);


    const sortKeys = (fd01) => {
        return Object.assign(...Object.entries(fd01).sort().map(([key, value]) => {
            return {
                [key]: value
            }
        }));
    };

    //displaying the chart
    const MARGINS = { top: 20, bottom: 0 }
    const CHART_WIDTH = 600;
    const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

    const ChartCointainer = d3.select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom)

    x.domain(fd01.map((d) => d.Category))
    y.domain([0, d3.max(fd01, d => parseInt(d[sales].slice(1)))])

    const chart = ChartCointainer.append('g');

    chart.append('g').call(d3.axisBottom(x).tickSizeOuter(0))
        .attr('transform', `translate(0, ${CHART_HEIGHT})`)
        .attr('color', '#4f009')

    chart
        .selectAll('.bar')
        .data(fd01)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', x.bandwidth())
        .attr('height', data => CHART_HEIGHT - y(parseInt(data[sales].slice(1))))
        .attr('x', (data) => x(data.Category))
        .attr('y', (data) => y(parseInt(data[sales].slice(1))))
        .on("click", function(a, d) {
            var salesIndx = this_year_sales.indexOf((d))
            document.getElementById("sales").innerHTML = this_year_sales[salesIndx]
        });

    chart
        .selectAll('.label')
        .data(fd01)
        .enter()
        .append('text')
        .text((data) => data[sales])
        .attr('x', data => x(data.Category) + x.bandwidth() / 2)
        .attr('y', data => y(parseInt(data['This Year Sales'].slice(1))) - 20)
        .attr('text-anchor', 'middle')
        .classed('label', true)
});