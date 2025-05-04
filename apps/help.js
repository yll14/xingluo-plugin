import plugin from "../../../lib/plugins/plugin.js";
import {
  _PATH,
  GetConfig,
  PluginName_zh,
  image,
  PluginName_en,
  PluginPath,
} from "../function/function.js";
import lodash from "lodash";
import Data from "../function/Data.js";
import render from "../function/renderer.js";
import Theme from "./Help/Helptheme.js";
import fs from "node:fs";
export class xingluoHelp extends plugin {
  constructor() {
    super({
      name: `${PluginName_zh}:帮助`,
      dsc: `${PluginName_zh}:帮助`,
      event: "message",
      priority: 1000,
      rule: [
        {
          reg: /^#?(xl|星落|xingluo)(插件)?(帮助|help|指令|菜单|命令)$/i,
          fnc: "ahelp",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?设置$/i,
          fnc: "Settinghelp",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?每日热搜$/i,
          fnc: "DailyHotType",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?表情包$/i,
          fnc: "MemesType",
        },
      ],
    });
  }

  /** 插件帮助 **/
  async ahelp() {
    return await help(this.e);
  }

  /** 设置帮助 **/
  async Settinghelp(e) {
    let config = {};
    let configFolder = `${PluginPath}/config`;
    const SettinghelpFilePath = `${configFolder}/Settinghelp.yaml`;
    if (fs.existsSync(SettinghelpFilePath)) {
      logger.info(
        logger.green(
          `[${PluginName_en}]:config中存在Settinghelp.yaml配置文件，已从/config文件夹中读取`,
        ),
      );
      let { config } = GetConfig(`config`, `Settinghelp`);
      config = config;
      let { img } = await image(e, "Settinghelp", "Settinghelp", {
        saveId: "Settinghelp",
        cwd: _PATH,
        iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
        Data: config,
        version: PluginVersion,
        author: PluginAuthor,
      });
      e.reply(img);
    } else {
      let { config } = GetConfig(`defSet/system`, `Settinghelp`);
      config = config;

      let { img } = await image(e, "Settinghelp", "Settinghelp", {
        saveId: "Settinghelp",
        cwd: _PATH,
        iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
        Data: config,
        version: PluginVersion,
        author: PluginAuthor,
      });
      e.reply(img);
    }
  }

  /** 每日热搜关键词 **/
  async DailyHotType(e) {
    let config = {};
    let configFolder = `${PluginPath}/config`;
    const DailyHotFilePath = `${configFolder}/DailyHot.yaml`;
    if (fs.existsSync(DailyHotFilePath)) {
      logger.info(
        logger.green(
          `[${PluginName_en}]:config中存在DailyHot.yaml配置文件，已从/config文件夹中读取`,
        ),
      );
      let { config } = GetConfig(`config`, `DailyHotType`);
      config = config;
      let { img } = await image(e, "DailyHotType", "DailyHotType", {
        saveId: "DailyHotType",
        cwd: _PATH,
        iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
        Data: config,
        version: PluginVersion,
        author: PluginAuthor,
      });
      e.reply(img);
    } else {
      let { config } = GetConfig(`defSet/system`, `DailyHotType`);
      config = config;
      let { img } = await image(e, "DailyHotType", "DailyHotType", {
        saveId: "DailyHotType",
        cwd: _PATH,
        iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
        Data: config,
        version: PluginVersion,
        author: PluginAuthor,
      });
      e.reply(img);
    }
  }

  /** 表情包关键词 **/
  async MemesType(e) {
    let config = {};
    let configFolder = `${PluginPath}/config`;
    const MemesFilePath = `${configFolder}/MemesType.yaml`;
    if (fs.existsSync(MemesFilePath)) {
      logger.info(
        logger.green(
          `[${PluginName_en}]:config中存在MemesType.yaml配置文件，已从/config文件夹中读取`,
        ),
      );
      let { config } = GetConfig(`config`, `MemesType`);
      config = config;
      let { img } = await image(e, "MemesType", "MemesType", {
        saveId: "MemesType",
        cwd: _PATH,
        iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
        Data: config,
        version: PluginVersion,
        author: PluginAuthor,
      });
      e.reply(img);
    } else {
      let { config } = GetConfig(`defSet/system`, `MemesType`);
      config = config;
      let { img } = await image(e, "MemesType", "MemesType", {
        saveId: "MemesType",
        cwd: _PATH,
        iconPath: `${_PATH}/plugins/${PluginName_en}/resources/`,
        Data: config,
        version: PluginVersion,
        author: PluginAuthor,
      });
      e.reply(img);
    }
  }
}
async function help(e) {
  let custom = {};
  let help = {};
  let { diyCfg, sysCfg } = await Data.importCfg("help");
  custom = help;
  let helpConfig = lodash.defaults(
    diyCfg.helpCfg || {},
    custom.helpCfg,
    sysCfg.helpCfg,
  );
  let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList;
  let helpGroup = [];
  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === "master" && !e.isMaster) {
      return true;
    }
    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1;
      if (!icon) {
        help.css = "display:none";
      } else {
        let x = (icon - 1) % 10;
        let y = (icon - x - 1) / 10;
        help.css = `background-position:-${x * 50}px -${y * 50}px`;
      }
    });
    helpGroup.push(group);
  });
  let themeData = await Theme.getThemeData(
    diyCfg.helpCfg || {},
    sysCfg.helpCfg || {},
  );
  return await render(
    "help/index",
    {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: "default",
    },
    { e, scale: 1 },
  );
}
