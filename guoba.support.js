import setting from "./function/setting.js";
import lodash from "lodash";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { PluginName_en, PluginName_zh } from "./function/function.js";
export function supportGuoba() {
  return {
    pluginInfo: {
      name: `${PluginName_en}`,
      title: `${PluginName_zh}(${PluginName_en})`,
      author: "洛洛",
      authorLink: "https://gitee.com/yll14/",
      link: "https://gitee.com/yll14/xingluo-plugin",
      showInMenu: "auto",
      isV3: true,
      isV2: false,
      description: `洛洛插件的重构版本`,
      icon: "mdi:stove",
      iconColor: "#d19f56",
      iconPath: path.join(__dirname, "resources/icon.jpg"),
    },
    configInfo: {
      schemas: [
        {
          label: "一言",
          component: "SOFT_GROUP_BEGIN",
        },
        {
          field: "Hitokoto.switch",
          label: "功能开关",
          bottomHelpMessage: "是否开启",
          component: "Switch",
        },
        {
          field: "Hitokoto.api",
          label: "一言API",
          helpMessage: "输入一言API",
          bottomHelpMessage:
            "输入一言API!!!注意检查返回格式是否一致!!! 默认https://v1.hitokoto.cn/",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: "请输入一言API",
          },
        },
        {
          field: "Hitokoto.Type",
          label: "一言返回类型",
          bottomHelpMessage: "选择一言返回类型",
          component: "Select",
          componentProps: {
            options: [
              {
                label: "纯文本(不带任何格式)",
                value: "text",
              },
              {
                label: "JSON(格式化好后的文本)",
                value: "json",
              },
            ],
          },
        },
        {
          field: "Hitokoto.min_length",
          label: "最小长度",
          helpMessage: "输入最小长度",
          bottomHelpMessage: "输入最小长度 最小长度不可大于最大长度 且不可相等",
          component: "InputNumber",
          required: true,
          componentProps: {
            min: 0,
            max: 70,
            placeholder: "请输入最小长度",
          },
        },
        {
          field: "Hitokoto.max_length",
          label: "最大长度",
          helpMessage: "输入最大长度",
          bottomHelpMessage: "输入最大长度 最大长度不可小于最小长度 且不可相等",
          component: "InputNumber",
          required: true,
          componentProps: {
            min: 0,
            max: 75,
            placeholder: "请输入最大长度",
          },
        },
        {
          field: "Hitokoto.sentenceType",
          label: "一言类型",
          helpMessage: "输入一言类型",
          bottomHelpMessage:
            "可选 a:动画 b:漫画 c:游戏 d:文学 e:原创 f:来自网络 g:其他 h:影视 i:诗词 j:网易云 k:哲学 l:抖机灵",
          component: "Input",
          required: false,
          componentProps: {
            placeholder:
              "请输入一言类型，选择多种类型使用英文逗号连接例如`a,b,c`",
          },
        },
        {
          label: "一言JSON模板",
          component: "SOFT_GROUP_BEGIN",
        },
        {
          field: "Hitokoto.templateswitch",
          label: "模板开关",
          bottomHelpMessage: "是否开启模板",
          component: "Switch",
        },
        {
          label: "每日热搜",
          component: "SOFT_GROUP_BEGIN",
        },
        {
          field: "DailyHot.switch",
          label: "功能开关",
          bottomHelpMessage: "是否开启",
          component: "Switch",
        },
        {
          field: "DailyHot.api",
          label: "API地址",
          helpMessage: "输入API地址",
          bottomHelpMessage: "输入API地址 末尾不要加'/'",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: "请输入API地址 末尾不要加'/'",
          },
        },
        {
          field: "DailyHot.showLink",
          label: "是否显示链接",
          bottomHelpMessage: "是否显示链接",
          component: "Switch",
        },
        {
          label: "Ping",
          component: "SOFT_GROUP_BEGIN",
        },
        {
          field: "Ping.switch",
          label: "功能开关",
          bottomHelpMessage: "是否开启",
          component: "Switch",
        },
        {
          field: "Ping.output",
          label: "显示输出",
          bottomHelpMessage: "是否显示输出",
          component: "Switch",
        },
        {
          field: "Ping.Networknodes",
          label: "使用节点",
          bottomHelpMessage: "是否使用节点",
          component: "Switch",
        },
        {
          field: "Ping.useNetworknodes",
          label: "使用双节点",
          bottomHelpMessage: "是否使用双节点",
          component: "Switch",
        },
        {
          field: "Ping.node",
          label: "节点",
          bottomHelpMessage: "选择节点",
          component: "Select",
          componentProps: {
            options: [
              {
                label: "a节点(香港)",
                value: "a",
              },
              {
                label: "b节点(江苏南京)",
                value: "b",
              },
            ],
          },
        },
        {
          label: "谁艾特我",
          component: "SOFT_GROUP_BEGIN",
        },
        {
          field: "whoAtme.switch",
          label: "功能开关",
          bottomHelpMessage: "是否开启",
          component: "Switch",
        },
        {
          field: "whoAtme.cacheImage",
          label: "缓存图片",
          bottomHelpMessage: "是否开启缓存图片",
          component: "Switch",
        },
        {
          field: "whoAtme.cacheTime",
          label: "缓存时间",
          bottomHelpMessage: "缓存时间请输入缓存时间单位小时(0-96)",
          component: "InputNumber",
          required: true,
          componentProps: {
            min: 0,
            max: 96,
            placeholder: "请输入缓存时间单位小时",
          },
        },
        {
          field: "whoAtme.reverse",
          label: "逆序遍历",
          bottomHelpMessage: "是否开启逆序遍历",
          component: "Switch",
        },
        {
          field: "whoAtme.cachePath",
          label: "缓存路径",
          bottomHelpMessage: "缓存路径 以Bot根目录为初始路径",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: "请输入缓存路径 以Bot根目录为初始路径",
          },
        },
        {
          label: "表情包",
          component: "SOFT_GROUP_BEGIN",
        },
        {
          field: "Memes.switch",
          label: "功能开关",
          bottomHelpMessage: "是否开启",
          component: "Switch",
        },
      ],
      getConfigData() {
        return setting.merge();
      },
      setConfigData(data, { Result }) {
        let config = {};
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value);
        }
        config = lodash.merge({}, setting.merge, config);
        setting.analysis(config);
        return Result.ok({}, "保存成功~ 重启后生效");
      },
    },
  };
}
