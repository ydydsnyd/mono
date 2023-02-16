import * as s from 'superstruct';

export const pointSchema = s.tuple([s.number(), s.array(s.number())]);
export type Point = s.Infer<typeof pointSchema>;

export const seriesSchema = s.type({
  metric: s.string(),
  points: s.array(pointSchema),
});
export type Series = s.Infer<typeof seriesSchema>;

export const reportMetricsSchema = s.type({
  series: s.array(seriesSchema),
});
export type ReportMetrics = s.Infer<typeof reportMetricsSchema>;
