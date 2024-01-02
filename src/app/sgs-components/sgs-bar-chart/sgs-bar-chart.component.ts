import { Component, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-sgs-bar-chart',
    templateUrl: './sgs-bar-chart.component.html',
    styleUrls: ['./sgs-bar-chart.component.scss'],
})
export class SgsBarChartComponent {
    // set the dimensions and margins of the graph
    margin = { top: 10, right: 10, bottom: 20, left: 30 };
    width = 700 - this.margin.left - this.margin.right;
    height = 220 - this.margin.top - this.margin.bottom;
    @Input() config: any = {};

    constructor() {}

    ngAfterViewInit(): void {
        this._drawChart(this.config);
    }

    private _drawChart(group: any) {
        d3.select(`.svg-container`).remove();
        var svg = d3
            .select(`figure#${group.id}`)
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        const groups = this.config.map((x: any) => x.name);
        // Add X axis
        var x = d3.scaleBand().domain(groups).range([0, this.width]).padding(0.2);
        svg.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        var y = d3.scaleLinear().domain([0, 40]).range([this.height, 0]);
        svg.append('g').call(d3.axisLeft(y));

        const subgroups = this.config[0].requests.map((x: any) => x.key);
        // Another scale for subgroup position?
        const xSubgroup: any = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding(0.5);

        // color palette = one color per subgroup
        const color: any = d3.scaleOrdinal().domain(subgroups).range(['#E17F25', '#2BC431', '#EA0000']);

        // Show the bars
        svg.append('g')
            .selectAll('g')
            // Enter in data = loop group per group
            .data(this.config)
            .enter()
            .append('g')
            .attr('transform', (d: any) => {
                return 'translate(' + x(d.name) + ',0)';
            })
            .selectAll('rect')
            .data((d: any) => {
                return subgroups.map((key: any) => {
                    const index = d.requests.findIndex((x: any) => x.key === key);
                    return { key: key, value: d.requests[index].count };
                });
            })
            .enter()
            .append('rect')
            .attr('x', (d: any) => {
                return xSubgroup(d.key);
            })
            .attr('y', (d: any) => {
                return y(d.value);
            })
            .attr('width', xSubgroup.bandwidth())
            .attr('height', (d: any) => {
                return this.height - y(d.value);
            })
            .attr('fill', (d: any) => {
                return color(d.key);
            });
    }
}
