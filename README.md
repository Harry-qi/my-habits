# 我的日常习惯  
用来每天提醒我一些琐碎的事情
效果图
![1](https://s2.loli.net/2022/02/10/u7G2IKbrTlm5eY4.jpg)
## 使用方式
1. 编辑`config.js`，在里面书写习惯
2. npm i 
3. npm run start

## `config.js`字段说明
|  字段   | 含义  | 是否必填| 类型|
|  ----  | ----  |  ---- | ---- |
| name  | 习惯的名字,例如: '喝奶茶' | 是| string |
| message  | 弹窗提醒的内容,例如: '三点几嚟,饮茶先啦' | 否| string |
| time  | 提醒的时间,例如: '15:00' | 是 | string |
| count | 每天提醒次数,例如: 2 | 否 | number |
| delay | 间隔分钟数,例如: 60；也支持数组，例如:[60,60*2]| 否 | number/array  |
| skipWeek | 是否跳过节假日。true:跳过节假日,默认不跳过节假日  | 否| boolean |
|stop|是否暂停,true:暂停|否|boolean|
---
delay为number的时候，count必填 

delay为array的时候，count不用填
     