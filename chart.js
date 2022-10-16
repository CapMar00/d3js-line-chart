const dateFormatter = d3.timeFormat("%d %B %Y");
const chartBody = d3.select("#chart_body");

d3.csv("data/weekly_fuel_prices_from_2005_to_20221015.csv").then((data) =>
  createChart(data)
);

const createChart = (data) => {
  const width = 550;
  const height = 320;

  data = data.map((d) => ({
    date: new Date(d.SURVEY_DATE),
    price: +d.HEATING_GAS_OIL,
  }));

  const dateRange = d3.extent(data, (d) => d.date);
  const maxValue = d3.max(data, (d) => d.price);

  const yScale = d3.scaleLinear().range([height, 0]).domain([0, maxValue]);
  const xScale = d3.scaleTime().range([0, width]).domain(dateRange);

  const valueLine = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.price));

  chartBody.append("g").call(d3.axisLeft(yScale));
  chartBody
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  chartBody
    .append("path")
    .datum(data)
    .attr("d", valueLine)
    .attr("class", "line");

  const div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  chartBody
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.price))
    .style("opacity", 0)
    .on("mouseover", (d) => {
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(
          dateFormatter(d.target["__data__"].date) +
            "<br/>" +
            d.target["__data__"].price
        )
        .style("left", d.x + "px")
        .style("top", d.y + "px");
    })
    .on("mouseout", (d) => {
      div.transition().duration(500).style("opacity", 0);
    });
};
