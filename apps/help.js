import plugin from "../../../lib/plugins/plugin.js";
import {
  _PATH,
  GetConfig,
  PluginName_zh,
  image,
  PluginName_en,
} from "../function/function.js";

export class xingluohelp extends plugin {
  constructor() {
    super({
      name: `${PluginName_zh}:帮助`,
      dsc: `${PluginName_zh}:帮助`,
      event: "message",
      priority: 500,
      rule: [
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(帮助|菜单|help|功能|说明|指令|使用说明|命令)$/i,
          fnc: "help",
        },{
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?设置$/i,
          fnc: "Settinghelp",
        }
      ],
    });
  }
  async help(e) {
    const { config } = GetConfig(`defSet`, `help`);
    let { img } = await image(e, "help", "help", {
      saveId: "help",
      cwd: _PATH,
      iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
      helpData: config,
      version: PluginVersion,
    });
    e.reply(img);
  }
  async Settinghelp(e) {
    const { config } = GetConfig(`defSet`, `Settinghelp`);
    let { img } = await image(e, "help", "Settinghelp", {
      saveId: "Settinghelp",
      cwd: _PATH,
      iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
      helpData: config,
      version: PluginVersion,
    });
    e.reply(img);
  }
}
