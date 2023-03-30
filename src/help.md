# a-picker

一款模拟安卓选择的picker选择器，适配移动端和pc端，可进行触摸操作。</n> powerby sweetwisdom@qq.com

<!-- The first content similar to the above structure will be the name and description information of the current component -->

<!-- Regardless of the order of the following content and the internal content of the table -->

## Props

| Name | Description | Type | Options | Default |
|----- |------------ |----- |-------- | ------- |
| value / v-model | 选中项绑定值 | string  | —                      | —                            |
| options         | 可选项数据源，custom时候生效，键名为label,value,             | [array] | —                      | []                     |
| type            | 选择器类型 (year/month/date/自定义custom) (年份/年+月/年+月+日/自定义) | string  | —                      | month                       |
| visiable        | 打开选择器组件,使用.sync修饰                                 | boolean | —                      | false                        |
| range           | range 日期范围,以-分割， 仅在时间起作用， [start,end]        | Array   | —                      | ["2020-01-01", "2099-12-31"] |
| spiltText       | 选择之间的文本，如不需要可以设为空                           | Array   | - | ["年", "月", "日"]           |
| titleName       | picker中间的标题，控制是否展示                               | string    | - | 日期                         |

<!-- The header of the table can be configured -->

## Events

| Name | Description |callback params |
|----- | ----------- |
| change | 当选中节点变化时触发， when fixed state changed | (label,value）返回当选择的选中值和选中值对应的value,某些情况下可能会用到 |

