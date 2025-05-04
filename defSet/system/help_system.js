import { PluginName_en, PluginName_zh } from "../../function/function.js";
/*
 * 此配置文件为系统使用，请勿修改，否则可能无法正常使用
 *
 * 如需自定义配置请复制修改到config目录下的help_default.js
 *
 **/

export const helpCfg = {
  title: `${PluginName_zh}帮助`,
  subTitle: `Yunzai-Bot & ${PluginName_en}`,
  columnCount: 3,
  colWidth: 265,
  theme: "all",
  themeExclude: ["default"],
  style: {
    fontColor: "#ceb78b",
    descColor: "#eee",
    contBgColor: "rgba(6, 21, 31, .5)",
    contBgBlur: 3,
    headerBgColor: "rgba(6, 21, 31, .4)",
    rowBgColor1: "rgba(6, 21, 31, .2)",
    rowBgColor2: "rgba(6, 21, 31, .35)",
  },
  bgBlur: false,
};

export const helpList = [
  {
    group: "可不加#前缀或使用/|代替",
    list: [
      {
        icon: 176,
        title: "#一言",
        desc: "每天一句",
      },
      {
        icon: 31,
        title: "#每日热搜 ",
        desc: "获取每日热搜",
      },
      {
        icon: 8,
        title: "#ping",
        desc: "ping地址",
      },
      {
        icon: 101,
        title: "#谁艾特我",
        desc: "查看近期谁艾特过我",
      },
      {
        icon: 180,
        title: "#星落表情包",
        desc: "随机表情包",
      },
      {
        icon: 22,
        title: "若发现Bug 请反馈或更改后提出pr谢谢您的帮助",
        desc: "反馈方式QQ:2243958507,邮箱:ll@yll14.cn",
      },
    ],
  },
];
export const isSys = true;
