# zc-picker

一款模拟安卓选择的picker选择器，适配移动端和pc端，可进行触摸操作。

![image-20230330102527456](https://gitee.com/ponyjie/mySou/raw/master/2023/03/upgit_20230330_1680152262.png)


[demo展示案例](https://codepen.io/sweetwisdom/pen/yLxWLLR)

## 主要功能

✅年份选择

✅年月选择

✅年月日选择

✅自定义选择器

## 安装



```shell
npm i zc-picker
```



## 使用

```js
import ZcPicker from "zc-picker";
Vue.use(ZcPicker);


```



```vue
 <el-button type="primary" @click="show = true">打开选择器</el-button>
      
    <a-picker
      v-model="selctedText"
      @select="select"
      :type="pickerSelct"
      :options="pickerOption"
      :visiable.sync="show"
   / >
```



## 参数说明

![image-20230330111200909](https://gitee.com/ponyjie/mySou/raw/master/2023/03/upgit_20230330_1680152268.png)

### Attributes



| 参数            | 说明                                                         | 类型    | 可选值                 | 默认值                       |
| :-------------- | :----------------------------------------------------------- | :------ | :--------------------- | :--------------------------- |
| value / v-model | 选中项绑定值                                                 | string  | —                      | —                            |
| options         | 可选项数据源，custom时候生效，键名为label,value,             | [array] | —                      | —                            |
| type            | 选择器类型 (year/month/date/自定义custom) (年份/年+月/年+月+日/自定义) | string  | —                      | —                            |
| visiable        | 打开选择器组件,使用.sync修饰                                 | string  | —                      | —                            |
| range           | range 日期范围,以-分割， 仅在时间起作用， [start,end]        | array   | —                      | ["2020-01-01", "2099-12-31"] |
| type            | 选择器类型 (year/month/date/自定义custom) (年份/年+月/年+月+日/自定义) | string  | year/month/date/custom | —                            |
| spiltText       | 选择之间的文本，如不需要可以设为空                           | array   |                        | ["年", "月", "日"]           |
| titleName       | picker中间的标题，控制是否展示                               | 日期    |                        | 日期                         |

### Events



| 事件名称 | 说明                   | 回调参数                                                     |
| :------- | :--------------------- | :----------------------------------------------------------- |
| select   | 当选中节点变化时触发， | （label,value）返回当选择的选中值和选中值对应的value,某些情况下可能会用到 |



