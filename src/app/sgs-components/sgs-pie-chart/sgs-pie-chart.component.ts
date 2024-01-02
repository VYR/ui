import { AfterViewInit, Component, DoCheck, Input } from '@angular/core';
import * as d3 from 'd3';
import { PieChartConfig } from './models/pie-chart.model';

@Component({
    selector: 'app-sgs-pie-chart',
    templateUrl: './sgs-pie-chart.component.html',
    styleUrls: ['./sgs-pie-chart.component.scss'],
})
export class SgsPieChartComponent implements DoCheck, AfterViewInit {
    private margin = { top: 10, right: 10, bottom: 10, left: 10 };
    private width = 400 - this.margin.left - this.margin.right;
    private height = 400 - this.margin.top - this.margin.bottom;
    private arcs: any;

    @Input() config: PieChartConfig = new PieChartConfig();
    constructor() {}

    ngAfterViewInit(): void {
        this.drawChart(this.config);
    }

    ngDoCheck() {
        this.drawChart(this.config);
    }

    private drawChart(group: any): void {
        d3.select(`.svg-container`).remove();
        var svg = d3
            .select(`figure#${group.id}`)
            .append('svg')
            .classed('svg-container', true)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .append('g')
            .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

        // Compute the position of each group on the pie:
        var pie = d3
            .pie()
            .sort(null) // Do not sort group by size
            .value((d: any) => {
                return d.value;
            });

        // The arc generator
        var arc: any = d3
            .arc()
            .innerRadius(Math.min(this.width, this.height) / 2 - 85)
            .outerRadius(Math.min(this.width, this.height) / 2 - 1)
            .cornerRadius(8);
        let data: any = group.data;
        if (group.total === 0) {
            data = [{ id: 'noRecords', name: 'No Records', value: 100, percentage: 0, color: '#f6f6f6' }];
        }
        this.arcs = pie(data);
        svg.append('g')
            .attr('stroke', 'white')
            .selectAll('path')
            .data(this.arcs)
            .enter()
            .append('path')
            .attr('fill', (d: any) => `${d.data.color}`)
            .attr('d', arc)
            .append('title')
            .text((d: any) => `${d.data.name}: ${d.data.value}`);

        svg.append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 22)
            .attr('text-anchor', 'middle')
            .selectAll('text')
            .data(this.arcs)
            .enter()
            .append('text')
            .attr('transform', (d: any) => `translate(${this.arcLabel().centroid(d)})`)
            .call((text) =>
                text
                    .append('tspan')
                    .attr('y', '-0.4em')
                    .attr('font-weight', 'bold')
                    .text((x: any) => x.data.percentage + '%')
            );
        if (group.total === 0) {
            svg.append('g')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 18)
                .attr('text-anchor', 'middle')
                .selectAll('text')
                .data([group])
                .enter()
                .append('text')
                .attr('transform', (d: any) => `translate(0,0)`)
                .text((x) => (x.total ? 'Overall: ' : ''))
                .call((text) =>
                    text
                        .append('tspan')
                        .attr('font-weight', 'bold')
                        .text((x) => 'No Data')
                );
        }
    }

    arcLabel() {
        const radius = (Math.min(this.width, this.height) / 2) * 0.8;
        return d3.arc().innerRadius(radius).outerRadius(radius);
    }
}
