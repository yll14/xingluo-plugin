import yaml from "yaml";
import fs from "node:fs";
import { _PATH, PluginName_en, PluginPath } from "../function/function.js";
import path from "node:path";

export default new (class Init {
  async init() {
    try {
      await this.loadConfig();
      await this.globalVersion();
      await this.globalAuthor();
      return { boolean: true, msg: null };
    } catch (error) {
      return { boolean: false, msg: error };
    }
  }
  async loadConfig() {
    let configFolder = `${PluginPath}/config`;
    let defSetFolder = `${PluginPath}/defSet`;
    if (!fs.existsSync(configFolder)) {
      fs.mkdirSync(configFolder);
    }
    /*const configFilePath = `${configFolder}/config.yaml`;
    const defConfigFilePath = `${defSetFolder}/config.yaml`;
    if (!fs.existsSync(configFilePath)) {
      fs.copyFileSync(defConfigFilePath, configFilePath);
    } else {
      const defConfig = yaml.parse(fs.readFileSync(defConfigFilePath, "utf8"));
      let config = yaml.parse(fs.readFileSync(configFilePath, "utf8"));
      for (const key in defConfig) {
        if (!config.hasOwnProperty(key)) {
          config[key] = defConfig[key];
        }
      }
      const updatedConfigYAML = yaml.stringify(config);
      fs.writeFileSync(configFilePath, updatedConfigYAML, "utf8");
    }
      */
    /** Hitokoto **/
    const HitokotoFilePath = `${configFolder}/Hitokoto.yaml`;
    const defHitokotoFilePath = `${defSetFolder}/Hitokoto.yaml`;
    if (!fs.existsSync(HitokotoFilePath)) {
      fs.copyFileSync(defHitokotoFilePath, HitokotoFilePath);
    } else {
      const defHitokoto = yaml.parse(
        fs.readFileSync(defHitokotoFilePath, "utf8"),
      );
      let Hitokoto = yaml.parse(fs.readFileSync(HitokotoFilePath, "utf8"));
      let updated = false;
      for (const key in defHitokoto) {
        if (!Hitokoto.hasOwnProperty(key)) {
          Hitokoto[key] = defHitokoto[key];
          updated = true;
        }
      }
      if (updated) {
        const updatedConfigYAML = yaml.stringify(Hitokoto);
        fs.writeFileSync(HitokotoFilePath, updatedConfigYAML, "utf8");
        logger.info(
          logger.green(
            `[${PluginName_en}]${path.basename(HitokotoFilePath)}配置文件缺少键值，已从/defSet文件夹中更新`,
          ),
        );
      }
    }
    /** DailyHot **/
    const DailyHotFilePath = `${configFolder}/DailyHot.yaml`;
    const defDailyHotFilePath = `${defSetFolder}/DailyHot.yaml`;
    if (!fs.existsSync(DailyHotFilePath)) {
      fs.copyFileSync(defDailyHotFilePath, DailyHotFilePath);
    } else {
      const defDailyHot = yaml.parse(
        fs.readFileSync(defDailyHotFilePath, "utf8"),
      );
      let DailyHot = yaml.parse(fs.readFileSync(DailyHotFilePath, "utf8"));
      let updated = false;
      for (const key in defDailyHot) {
        if (!DailyHot.hasOwnProperty(key)) {
          DailyHot[key] = defDailyHot[key];
          updated = true;
        }
      }
      if (updated) {
        const updatedConfigYAML = yaml.stringify(DailyHot);
        fs.writeFileSync(DailyHotFilePath, updatedConfigYAML, "utf8");
        logger.info(
          logger.green(
            `[${PluginName_en}]${path.basename(DailyHotFilePath)}配置文件缺少键值，已从/defSet文件夹中更新`,
          ),
        );
      }
    }
    /** Ping **/
    const PingFilePath = `${configFolder}/Ping.yaml`;
    const defPingFilePath = `${defSetFolder}/Ping.yaml`;
    if (!fs.existsSync(PingFilePath)) {
      fs.copyFileSync(defPingFilePath, PingFilePath);
    } else {
      const defPing = yaml.parse(fs.readFileSync(defPingFilePath, "utf8"));
      let Ping = yaml.parse(fs.readFileSync(PingFilePath, "utf8"));
      let updated = false;
      for (const key in defPing) {
        if (!Ping.hasOwnProperty(key)) {
          Ping[key] = defPing[key];
          updated = true;
        }
      }
      if (updated) {
        const updatedConfigYAML = yaml.stringify(Ping);
        fs.writeFileSync(PingFilePath, updatedConfigYAML, "utf8");
        logger.info(
          logger.green(
            `[${PluginName_en}]${path.basename(PingFilePath)}配置文件缺少键值，已从/defSet文件夹中更新`,
          ),
        );
      }
    }
    /*
        if(!fs.existsSync(`./plugins/${PluginName_en}/config/.yaml`)) {
          fs.copyFileSync(`./plugins/${PluginName_en}/defSet/.yaml`, `./plugins/${PluginName_en}/config/.yaml`)
        } else {
          let config = yaml.parse(fs.readFileSync(`./plugins/${PluginName_en}/config/.yaml`, `utf-8`))
          let configNT = config.nothingText || []
          config = config.
          let defcfg = yaml.parse(fs.readFileSync(`./plugins/${PluginName_en}/defSet/.yaml`, `utf-8`))
          let defcfgNT = defcfg.nothingText
          defcfg = defcfg.
          fs.writeFileSync(`./plugins/${PluginName_en}/config/.yaml`, yaml.stringify({ : [...new Set(config.concat(defcfg))], nothingText: [...new Set(configNT.concat(defcfgNT))] }), `utf-8`)
        }*/
  }
  async globalVersion() {
    let PluginVersion = JSON.parse(
      fs.readFileSync(`./plugins/${PluginName_en}/package.json`, `utf-8`),
    );
    PluginVersion = PluginVersion.version;
    global.PluginVersion = PluginVersion;
  }
  async globalAuthor() {
    try {
      // 网络获取
      let PluginAuthor = await fetch(`https://web.yll14.cn?type=author`).then(
        (res) => res.json(),
      );
      PluginAuthor = PluginAuthor.author;
      global.PluginAuthor = PluginAuthor;
    } catch (error) {
      logger.info(logger.yellow(`可忽略的警告`));
      logger.info(
        logger.blue(`[${PluginName_en}]`),
        logger.white(`网络获取作者信息失败:`),
        logger.red(`${error}`),
      );
      logger.info(logger.green(`已从本地获取文件获取作者信息`));
      try {
        // 本地获取
        let PluginAuthor = JSON.parse(
          fs.readFileSync(`./plugins/${PluginName_en}/package.json`, `utf-8`),
        );
        PluginAuthor = PluginAuthor.author;
        global.PluginAuthor = PluginAuthor;
      } catch (error) {
        logger.info(logger.red(`出现错误！`));
        logger.info(
          logger.blue(`[${PluginName_en}]`),
          logger.white(`本地获取作者信息失败:`),
          logger.red(`${error}`),
        );
        global.PluginAuthor = `未知作者-` + PluginVersion;
      }
    }
  }
})();
