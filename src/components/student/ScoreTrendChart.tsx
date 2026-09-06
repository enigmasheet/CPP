"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { PASS_THRESHOLD_RATIO, MAX_SCORE_PERCENTAGE, MIN_SCORES_FOR_TREND_CHART, SCORE_TREND_CHART_HEIGHT, SCORE_TREND_TITLE_MAX_LENGTH } from "@/lib/constants";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface QuizResult {
  code: string;
  title: string;
  date: string;
  percentage: number;
}

interface ScoreTrendChartProps {
  results: QuizResult[];
}

export default function ScoreTrendChart({ results }: ScoreTrendChartProps) {
  const chartData = useMemo(() => {
    return results
      .slice()
      .reverse()
      .map((r, idx) => ({
        index: idx + 1,
        score: r.percentage,
        label: r.title.length > SCORE_TREND_TITLE_MAX_LENGTH ? r.title.slice(0, SCORE_TREND_TITLE_MAX_LENGTH) + "..." : r.title,
        date: new Date(r.date).toLocaleDateString(),
      }));
  }, [results]);

  const passThreshold = PASS_THRESHOLD_RATIO * MAX_SCORE_PERCENTAGE;

  if (results.length < MIN_SCORES_FOR_TREND_CHART) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Score Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={SCORE_TREND_CHART_HEIGHT}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="index"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              domain={[0, MAX_SCORE_PERCENTAGE]}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: ValueType, _name: NameType, props: { payload?: { label?: string; date?: string } }) => [
                `${value}%`,
                props.payload?.label ?? "",
              ]}
              labelFormatter={(_label: React.ReactNode, payload: Array<{ payload?: { date?: string } }>) => {
                return payload?.[0]?.payload?.date ?? "";
              }}
            />
            <ReferenceLine
              y={passThreshold}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{
                value: `Pass (${passThreshold}%)`,
                position: "right",
                className: "text-xs fill-muted-foreground",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
