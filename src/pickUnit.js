/**
 * 根据类型和范围生成时间选项
 * @param {*} type  年  | 年+月  | 年+月+日 |
 * @param {*} range 范围 [2022-12-01, 2022-12-31]
 */
export function generateTimeOptions(type, range, select) {
  // console.log(select, "选择变化了");
  const resOptions = [];
  const [start, end] = range;
  let [startYear, startMonth, startDay] = start.split("-");
  let [endYear, endMonth, endDay] = end.split("-");
  const [selectYear, selectMonth, selectDay] = select.split("-");
  const yearOptions = [];
  const monthOptions = [];
  const dayOptions = [];
  for (let i = startYear - 0; i <= endYear - 0; i++) {
    yearOptions.push({
      label: i,
      value: i,
    });
  }
  //   如果最大月份为2022-04 则最大月份为4
  if (selectYear == endYear) {
    endMonth = endMonth - 0;
  } else {
    endMonth = 12;
  }
  //  如果最大日期为2022-04-30 则最大日期为30
  if (selectYear == endYear && selectMonth == endMonth) {
    endDay = endDay - 0;
  } else {
    // 获取当前月份的最大天数
    endDay = new Date(selectYear, selectMonth, 0).getDate();
  }
  // 如果最小月份为2022-04 则最小月份为4
  if (selectYear == startYear) {
    startMonth = startMonth - 0;
  } else {
    startMonth = 1;
  }
  //  如果最小日期为2022-04-30 则最小日期为30
  if (selectYear == startYear && selectMonth == startMonth) {
    startDay = startDay - 0;
  } else {
    startDay = 1;
  }
  console.log(startDay, endDay, "最大最小日期");

  for (let i = startMonth - 0; i <= 12 - 0; i++) {
    monthOptions.push({
      label: i,
      value: i,
      disabled: i > endMonth,
    });
  }

  for (let i = startDay - 0; i <= 31 - 0; i++) {
    dayOptions.push({
      label: i,
      value: i,
      disabled: i > endDay,
    });
  }
  switch (type) {
    case "year":
      resOptions.push(yearOptions);
      break;
    case "month":
      resOptions.push(yearOptions, monthOptions);
      break;
    case "date":
      resOptions.push(yearOptions, monthOptions, dayOptions);
      break;
    default:
      break;
  }
  return resOptions;
}
