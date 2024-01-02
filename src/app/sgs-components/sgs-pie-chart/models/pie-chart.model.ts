export class PieChartConfig {
    id!: string;
    total?: number;
    totalLabel?: string;
    data!: Array<PieChartCell>;
}
export class PieChartCell {
    id?: string;
    name!: string;
    value!: number;
    percentage?: number;
    color!: string;
}
