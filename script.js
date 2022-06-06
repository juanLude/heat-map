let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

let baseTemp
let values = [];

let xScale
let yScale

let width = 1200
let height = 600
let padding = 60

let canvas = d3.select('#canvas')

let tooltip = d3.select('#tooltip')

canvas.attr('width', width)
canvas.attr('height', height)

let generateScales = () => {
    xScale = d3.scaleLinear()
        .domain([d3.min(values, item => item.year), d3.max(values, item => item.year)])
        .range([padding, width - padding])
    yScale = d3.scaleTime()
        .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
        .range([padding, height - padding])

}

let drawCells = () => {

    canvas.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('fill', item => {
            variance = item['variance']
            if (variance <= -1) {
                return 'SteelBlue'
            } else if (variance <= 0) {
                return 'LightSteelBlue'
            } else if (variance <= 1) {
                return 'Orange'
            } else {
                return 'Crimson'
            }
        })
        .attr('data-year', item => {
            return item['year']
        })
        .attr('data-month', item => {
            return item['month'] - 1
        })
        .attr('data-temp', item => {
            return item['variance'] + baseTemp
        })
        .attr('height', (height - (2 * padding)) / 12)
        .attr('y', item => {
            return yScale(new Date(0, item['month'] - 1, 0, 0, 0, 0, 0, 0))
        })
        .attr('width', item => {
            let numberOfYears = d3.max(values, item => item.year) - d3.min(values, item => item.year)
            return (width - 2 * padding) / numberOfYears
        })
        .attr('x', item => {
            return xScale(item['year'])
        })
        .on('mouseover', item =>{
            tooltip.transition()
                    .style('visibility', 'visible')
            let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"]
            tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1 ] + ' - ' + (baseTemp + item['variance']) )
            tooltip.attr('data-year', item['year'])
        })
        .on('mouseout', item=>{
            tooltip.transition()
                    .style('visibility', 'hidden')
        })
        

}

let drawAxes = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%B'))

    canvas.append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .attr('id', 'x-axis')

    canvas.append('g')
        .call(yAxis)
        .attr('transform', 'translate(' + padding + ',0)')
        .attr('id', 'y-axis')

}

fetch(url)
    .then(res => res.json())
    .then(data => {
        baseTemp = data.baseTemperature
        values = data.monthlyVariance
        console.log(baseTemp, values);
        generateScales()
        drawCells()
        drawAxes()
    })





