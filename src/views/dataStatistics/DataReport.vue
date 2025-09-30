<template>
  <div class="report-container">
    <!-- 图表容器必须有宽高 -->
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// 按需导入 ECharts 核心模块
import * as echarts from "echarts/core";
// 引入图表类型
import { LineChart } from "echarts/charts";
// 引入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from "echarts/components";
// 引入渲染器
import { CanvasRenderer } from "echarts/renderers";
// 引入过渡动画
import { UniversalTransition } from "echarts/features";
import { getReport } from "@/api/report";
import type { ReportResponse } from "@/interface";

// 注册必须的组件
echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent, CanvasRenderer, UniversalTransition]);

const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;
let reportOptions = ref<ReportResponse>({
  legend: {
    data: []
  },
  series: [],
  xAxis: [],
  yAxis: []
})

onMounted(async () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);

    try {
      const res = await getReport()
      console.log(res);

      reportOptions.value = res.data.data
      console.log(reportOptions.value, 111)
      console.log(reportOptions.value.legend.data)
    } catch (error: any) {
      ElMessage.error(error.message);
      return;
    }

    const option: echarts.EChartsCoreOption = {
      title: {
        text: '用户来源',
        left: 'left'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        top: 'top',
        data: reportOptions.value.legend.data
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: reportOptions.value.xAxis[0].data
        }
      ],
      yAxis: reportOptions.value.yAxis,
      series: reportOptions.value.series,

    };

    myChart.setOption(option);

    // 监听窗口大小变化
    window.addEventListener("resize", () => {
      myChart?.resize();
    });
  }
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});
</script>

<style scoped>
.report-container {
  margin-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 800px;
  height: 400px;
  padding-top: 20px;
}
</style>
