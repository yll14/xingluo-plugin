import setting from "./function/setting.js";
import lodash from "lodash";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { PluginName_en, PluginName_zh, Author } from "./function/function.js";
export function supportGuoba() {
  return {
    pluginInfo: {
      name: `${PluginName_en}`,
      title: `${PluginName_zh}(${PluginName_en})`,
      author: "洛洛",
      authorLink: "https://gitee.com/yll14/",
      link: "https://gitee.com/yll14/xingluo-plugin",
      isV3: true,
      isV2: false,
      description: `洛洛插件的重构版本`,
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
          field: "updatetask.customRepository",
          label: "自定义仓库地址",
          helpMessage: "支持添加多个仓库地址，使用英文逗号分隔",
          bottomHelpMessage: "格式：https://gitee.com/用户名/仓库名",
          component: "Input",
          required: true,
          componentProps: {
            placeholder: "请输入Gitee仓库地址，多个地址用英文逗号分隔",
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
