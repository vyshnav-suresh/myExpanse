// components/EChartsComponent.tsx

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { useAppSelector } from "@/lib/hook/useStatesHook";

interface props {
  data: any;
}
const EChartsComponent: React.FC<props> = ({ data }: props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { categoryWise } = useAppSelector((state) => state.basic);
  // const data1: any = localStorage.getItem("categorySums");
  // const categorySums = JSON.parse(data1);
  const [category, setCategory] = useState();
  const keys: any = (categoryWise && Object.keys(categoryWise)) ?? []; // Array of keys
  const values: any = (categoryWise && Object.values(categoryWise)) ?? []; // Array of values
  useEffect(() => {}, []);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        xAxis: {
          type: "category",
          data: keys,
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 10000,
          interval: 1000,
          axisLabel: { formatter: `{value} rs` },
        },
        series: [
          {
            data: values,
            type: "bar",
          },
        ],
      };

      myChart.setOption(option);

      // Clean up on unmount
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default EChartsComponent;
