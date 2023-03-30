<script>
import Vue from "vue";
import ZcPicker from "@/zc-picker.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    ZcPicker,
  },
  data() {
    return {
      select: "2029-10",
      show: false,
      range: ["2020-03-12", "2023-6-20"],
      options: [
        [
          { label: "湖北省", value: 0 },
          { label: "湖南省", value: 1 },
          { label: "广东省", value: 2, disabled: 1 },
          { label: "广西省", value: 3 },
          { label: "江西省", value: 4 },
          { label: "江苏省", value: 5 },
          { label: "浙江省", value: 6 },
          { label: "安徽省", value: 7 },
          { label: "福建省", value: 8 },
          { label: "山东省", value: 9 },
          { label: "河南省", value: 10 },
        ],
      ],
      picker2: {
        show: false,
        select: "",
        type: "custom",
      },
    };
  },
  methods: {
    handle(a,b) {
      console.log("选中了",a,b);
    },
  },
});
</script>

<template>
  <div id="app">
    <button @click="show = true">开始选中</button>
    <button @click="picker2.show = true">自定义{{ picker2.select }}</button>
    <p><span>选中的值：</span> {{ select }}</p>
    <zc-picker v-model="picker2.select" type="picker2.type" :options="options" :visiable.sync="picker2.show" />
    <zc-picker v-model="select" type="date" @select="handle" :range="range" :visiable.sync="show" />
  </div>
</template>

