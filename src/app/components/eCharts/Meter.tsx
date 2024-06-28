import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GaugeChart, GaugeSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useAppSelector } from "@/lib/hook/useStatesHook";

echarts.use([GaugeChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<GaugeSeriesOption>;
type props = {
  value: number;
};

const GaugeChartComponent: React.FC<props> = ({ value }: props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { maxAmount } = useAppSelector((state) => state.settings);

  useEffect(() => {
    const chartDom = chartRef.current!;
    const myChart = echarts.init(chartDom);
    const option: EChartsOption = {
      series: [
        {
          type: "gauge",
          max: maxAmount,
          axisLine: {
            lineStyle: {
              width: 2,
              color: [
                [0.3, "#419a3a"],
                [0.7, "#FFFA41"],
                [1, "#ff0000"],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: "auto",
            },
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: "#fff",
              width: 2,
            },
          },
          splitLine: {
            distance: -30,
            length: 0,
            lineStyle: {
              color: "#fff",
              width: 4,
            },
          },
          axisLabel: {
            color: "inherit",
            distance: 40,
            fontSize: 14,
          },
          detail: {
            valueAnimation: true,
            formatter: "₹ {value}",
            color: "#fff",
          },
          data: [
            {
              value: 7000,
            },
          ],
        },
      ],
    };

    myChart.setOption(option);

    const interval = setInterval(() => {
      myChart.setOption<EChartsOption>({
        series: [
          {
            data: [
              {
                value: value,
              },
            ],
            // label: {
            //   show: true,
            //   fontSize: 16,
            // },
          },
        ],
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      myChart.dispose();
    };
  }, [value, maxAmount]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "300px" }}
      className="text-xs"
    />
  );
};

export default GaugeChartComponent;
