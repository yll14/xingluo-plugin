import setting from "./function/setting.js";
import lodash from "lodash";
import path from 'path';
import { PluginName_en, PluginName_zh, Author } from "./function/function.js";
export function supportGuoba() {
  return {
    pluginInfo: {
      name: `${PluginName_en}`,
      title: `${PluginName_zh}(${PluginName_en})`,
      author: Author(),
      authorLink: "https://gitee.com/yll14/",
      link: "https://gitee.com/yll14/xingluo-plugin",
      isV3: true,
      isV2: false,
      description: `luoluo-plugin的重构版本`,
      icon: "mdi:stove",

      iconColor: "#d19f56",

      iconPath: path.join(__dirname, "resources/logo.gif"),
    },
    configInfo: {
      schemas: [
        {
          field: "updatetask.switch",
          label: "功能开关",
          bottomHelpMessage: "是否开启",
          component: "Switch",
        },
        {
          field: "updatetask.cron",
          label: "定时检查更新时间",
          helpMessage:
            "不会cron表达式？前往<https://cron.qqe2.com/>或者<https://www.jyshare.com/front-end/9444/>获取帮助)",
          bottomHelpMessage:
            "填入cron表达式，该项保存后重启生效(格式错了定时检查更新就寄啦)",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: "请输入cron表达式",
          },
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
        return Result.ok({}, "保存成功~");
      },
    },
  };
}
