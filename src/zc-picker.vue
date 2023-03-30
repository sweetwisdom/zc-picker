<template>
  <div class="container">
    <transition name="picker-fade">
      <div class="picker" v-show="state === 1" @touchmove.prevent @click="_cancel">
        <transition name="picker-move">
          <div class="picker-panel" v-show="state === 1" @click.stop>
            <div class="picker-choose border-bottom-1px">
              <!-- <span class="cancel" @click="_cancel">Cancel</span>
              <span class="confirm" @click="_confirm">Confirm</span> -->
              <h1 class="picker-title">{{ title }}</h1>
            </div>
            <div class="picker-content">
              <div class="mask-top border-bottom-1px"></div>
              <div class="mask-bottom border-top-1px"></div>
              <div class="wheel-wrapper" ref="wheelWrapper">
                <div class="wheel" v-for="(data, index) in pickerData" :key="index">
                  <ul class="wheel-scroll">
                    <li v-for="item in data" :key="item.value" :class="{ 'wheel-disabled-item': item.disabled }" class="wheel-item">
                      {{ item.label }}
                      <!-- <span v-if="!isCustom">{{ spiltText[index] }}</span> -->
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="picker-footer">
              <div>
                <span class="confirmText" @click="_confirm">确定</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import { generateTimeOptions } from "./pickUnit";
import BScroll from "@better-scroll/core";
import Wheel from "@better-scroll/wheel";
BScroll.use(Wheel);
const STATE_HIDE = 0;
const STATE_SHOW = 1;

const COMPONENT_NAME = "ZcPicker";
const EVENT_SELECT = "select";
const EVENT_CANCEL = "cancel";
const EVENT_CHANGE = "change";

export default {
  name: COMPONENT_NAME,
  data() {
    return {
      state: STATE_HIDE,
      selectedIndexPair: [0, 0],
      selectedText: "",
      temSelectedText: "",
    };
  },
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    titleName: {
      type: String,
      default: "日期",
    },
    // value string
    value: {
      type: String,
      default: "",
    },
    // type 类型  (year/month/date/自定义custom)

    type: {
      type: String,

      default: "month",
    },
    // range 日期范围 仅在时间起作用
    range: {
      type: Array,
      default: () => ["2020-01-01", "2099-12-31"],
    },
    spiltText: {
      type: Array,
      default: () => ["年", "月", "日"],
    },
  },
  watch: {
    value: {
      handler(val, oldVal) {
        if (val === oldVal) return;
        if (val === this.selectedText) return;
        this.selectedText = val;
      },
      immediate: true,
    },
    visiable(val) {
      val && this.show();
    },
  },
  computed: {
    isCustom() {
      return this.type == "custom";
    },
    title() {
      return "请选择" + this.titleName + "范围";
    },
    pickerData() {
      const { type, options, range, temSelectedText } = this;
      const timeType = ["year", "month", "date"];
      if (timeType.includes(type)) {
        return generateTimeOptions(type, range, temSelectedText);
      } else {
        return options || [];
      }
    },
  },
  methods: {
    getCurrenrSelected() {
      const currentSelectedIndexPair = (this.selectedIndexPair = this.wheels.map((wheel) => {
        return wheel.getSelectedIndex();
      }));
      return this.pickerData
        .map((data, i) => {
          const index = currentSelectedIndexPair[i];

          return `${data[index]?.label}`;
        })
        .join("-");
    },
    _confirm() {
      this.wheels.forEach((wheel) => {
        wheel.restorePosition();
      });
      this.hide();

      const currentSelectedIndexPair = (this.selectedIndexPair = this.wheels.map((wheel) => {
        return wheel.getSelectedIndex();
      }));
      let selectedValue = this.pickerData.map((data, i) => data[currentSelectedIndexPair[i]].value).join("-");

      this.selectedText = this.pickerData
        .map((data, i) => {
          const index = currentSelectedIndexPair[i];

          return `${data[index].label}`;
        })
        .join("-");
      // 赋值
      this.$emit("input", this.selectedText);
      this.$emit(EVENT_SELECT, this.selectedText, selectedValue);
    },
    _cancel() {
      /*
       * if bs is scrolling, restore it to the start position
       * it is same with iOS picker and web Select element implementation
       * supported at v2.1.0
       */
      this.wheels.forEach((wheel) => {
        wheel.restorePosition();
      });
      this.hide();
      this.$emit(EVENT_CANCEL);
    },
    show() {
      if (this.state === STATE_SHOW) {
        return;
      }

      this.state = STATE_SHOW;

      if (!this.wheels) {
        // waiting for DOM rendered
        this.$nextTick(() => {
          this.wheels = [];

          let wheelWrapper = this.$refs.wheelWrapper;
          for (let i = 0; i < this.pickerData.length; i++) {
            this._createWheel(wheelWrapper, i);
          }
          this.initFirst();

          // 根据 selectedText 设置初始位置
        });
      }
    },
    hide() {
      this.$emit("update:visiable", false);
      this.state = STATE_HIDE;
    },
    initFirst() {
      const selectedTextArr = this.selectedText.split("-");
      this.pickerData.forEach((data, i) => {
        const index = data.findIndex((item) => item.label == selectedTextArr[i]);
        this.wheels[i].wheelTo(index);
      });
    },
    _createWheel(wheelWrapper, i) {
      if (!this.wheels[i]) {
        this.wheels[i] = new BScroll(wheelWrapper.children[i], {
          wheel: {
            selectedIndex: this.selectedIndexPair[i],
            wheelWrapperClass: "wheel-scroll",
            wheelItemClass: "wheel-item",
          },
          probeType: 3,
        });
        this.wheels[i].on("scrollEnd", () => {
          this.$emit(EVENT_CHANGE, i, this.wheels[i].getSelectedIndex());
          this.temSelectedText = this.getCurrenrSelected();
          //   console.log("滚动了🤖", this.temSelectedText, i, this.wheels.length);

          if (i < this.wheels.length - 1) {
            this.wheels[i + 1].wheelTo(0);
          }
        });
        // 监听滚动状态
      } else {
        this.wheels[i].refresh();
      }

      return this.wheels[i];
    },
  },
};
</script>

<style scoped>
.confirmText {
  padding: 5px 20px;

  z-index: 2;
}

ul {
  list-style: none;
  padding: 0;
}
.border-bottom-1px,
.border-top-1px {
  position: relative;
}
.border-bottom-1px:before,
.border-top-1px:before,
.border-bottom-1px:after,
.border-top-1px:after {
  content: "";
  display: block;
  position: absolute;
  transform-origin: 0 0;
}
.border-bottom-1px:after {
  border-bottom: 1px solid #ebebeb;
  left: 0;
  bottom: 0;
  width: 100%;
  transform-origin: 0 bottom;
}
.mask-top.border-bottom-1px:after {
  border-bottom: 1px solid #e90c2b;
}
.border-top-1px:before {
  border-top: 1px solid #e90c2b;
  left: 0;
  top: 0;
  width: 100%;
  transform-origin: 0 top;
}
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-top-1px:before {
    width: 200%;
    transform: scale(0.5) translateZ(0);
  }
  .border-bottom-1px:after {
    width: 200%;
    transform: scale(0.5) translateZ(0);
  }
}
@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .border-top-1px:before {
    width: 300%;
    transform: scale(0.333) translateZ(0);
  }
  .border-bottom-1px:after {
    width: 300%;
    transform: scale(0.333) translateZ(0);
  }
}
.example-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 2rem;
}
.example-list .example-item {
  background-color: #fff;
  padding: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 1rem;
  flex: 1;
}
.example-list .example-item.placeholder {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
}
.picker {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  background-color: rgba(37, 38, 45, 0.4);
}
.picker.picker-fade-enter,
.picker.picker-fade-leave-active {
  opacity: 0;
}
.picker.picker-fade-enter-active,
.picker.picker-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.picker .picker-panel {
  vertical-align: middle;
  background-color: #fff;
  color: #000;
  margin: 0;
  height: auto;
  width: 400px;
  max-height: 95vw;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9901;
  overflow: hidden;
}
.picker .picker-panel.picker-move-enter,
.picker .picker-panel.picker-move-leave-active {
  transform: translate3d(-50%, 50%, 0);
}
@keyframes slideFromTop {
  0% {
    top: -100vh;
  }
  100% {
    top: 0;
  }
}
.picker .picker-panel.picker-move-enter-active,
.picker .picker-panel.picker-move-leave-active {
  transition: all 0.3s ease-in-out;
}
.picker .picker-panel .picker-choose {
  position: relative;
  height: 40px;
  color: #fff;
  background-color: #0575f2;
}
.picker .picker-panel .picker-choose .picker-title {
  margin: 0;
  line-height: 40px;
  font-weight: normal;
  text-align: center;
  font-size: 16px;
}
.picker .picker-panel .picker-choose .confirm,
.picker .picker-panel .picker-choose .cancel {
  position: absolute;
  top: 6px;
  padding: 16px;
  font-size: 14px;
}
.picker .picker-panel .picker-choose .confirm {
  right: 0;
}
.picker .picker-panel .picker-choose .confirm:active {
}
.picker .picker-panel .picker-choose .cancel {
  left: 0;
}
.picker .picker-panel .picker-choose .cancel:active {
}
.picker .picker-panel .picker-content {
  position: relative;
  top: 20px;
}
.picker .picker-panel .picker-content .mask-top,
.picker .picker-panel .picker-content .mask-bottom {
  z-index: 10;
  width: 100%;
  height: 68px;
  pointer-events: none;
  transform: translateZ(0);
}
.picker .picker-panel .picker-content .mask-top {
  position: absolute;
  top: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}
.picker .picker-panel .picker-content .mask-bottom {
  position: absolute;
  bottom: 1px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}
.picker .picker-panel .wheel-wrapper {
  display: flex;
  padding: 0 16px;
}
.picker .picker-panel .wheel-wrapper .wheel {
  flex: 1;
  width: 1%;
  height: 173px;
  overflow: hidden;
  font-size: 18px;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll {
  padding: 0;
  margin-top: 68px;
  line-height: 36px;
  list-style: none;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll .wheel-item {
  list-style: none;
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
  color: #333;
}
.picker .picker-panel .wheel-wrapper .wheel .wheel-scroll .wheel-item.wheel-disabled-item {
  opacity: 0.2;
}
.picker .picker-footer {
  margin-top: 20px;
  height: 40px;

  line-height: 40px;
  font-size: 16px;
  color: #0575f2;
  font-weight: bold;
}
</style>

