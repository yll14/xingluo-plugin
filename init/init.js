import yaml from "yaml";
import fs from "node:fs";
import { _PATH, PluginName_en, PluginPath } from "../function/function.js";
import path from "node:path";
import { Hitokoto } from "../apps/Hitokoto.js";

export default new (class Init {
  async init() {
    try {
      await this.loadConfig();
      await this.globalVersion();
      await this.globalAuthor();
      await this.globalHitokoto();
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
    /** whoAtme **/
    const whoAtmeFilePath = `${configFolder}/whoAtme.yaml`;
    const defwhoAtmeFilePath = `${defSetFolder}/whoAtme.yaml`;
    if (!fs.existsSync(whoAtmeFilePath)) {
      fs.copyFileSync(defwhoAtmeFilePath, whoAtmeFilePath);
    } else {
      const defwhoAtme = yaml.parse(
        fs.readFileSync(defwhoAtmeFilePath, "utf8"),
      );
      let whoAtme = yaml.parse(fs.readFileSync(whoAtmeFilePath, "utf8"));
      let updated = false;
      for (const key in defwhoAtme) {
        if (!whoAtme.hasOwnProperty(key)) {
          whoAtme[key] = defwhoAtme[key];
          updated = true;
        }
      }
      if (updated) {
        const updatedConfigYAML = yaml.stringify(whoAtme);
        fs.writeFileSync(whoAtmeFilePath, updatedConfigYAML, "utf8");
        logger.info(
          logger.green(
            `[${PluginName_en}]${path.basename(whoAtmeFilePath)}配置文件缺少键值，已从/defSet文件夹中更新`,
          ),
        );
      }
    }

    /** Memes **/
    const MemesFilePath = `${configFolder}/Memes.yaml`;
    const defMemesFilePath = `${defSetFolder}/Memes.yaml`;
    if (!fs.existsSync(MemesFilePath)) {
      fs.copyFileSync(defMemesFilePath, MemesFilePath);
    } else {
      const defMemes = yaml.parse(
        fs.readFileSync(defMemesFilePath, "utf8"),
      );
      let Memes = yaml.parse(fs.readFileSync(MemesFilePath, "utf8"));
      let updated = false;
      for (const key in defMemes) {
        if (!Memes.hasOwnProperty(key)) {
          Memes[key] = defMemes[key];
          updated = true;
        }
      }
      if (updated) {
        const updatedConfigYAML = yaml.stringify(Memes);
        fs.writeFileSync(MemesFilePath, updatedConfigYAML, "utf8");
        logger.info(
          logger.green(
            `[${PluginName_en}]${path.basename(MemesFilePath)}配置文件缺少键值，已从/defSet文件夹中更新`,
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
  async globalHitokoto() {
    let api = [
      "https://v1.hitokoto.cn/",
      "https://international.v1.hitokoto.cn",
    ];
    try{  
    let Hitokoto = await fetch(api[0]).then(
      (res) => res.json()
    );
    Hitokoto = Hitokoto.hitokoto;
    global.BotHitokoto = Hitokoto;
    } catch (error) {
      try {
        let Hitokoto = await fetch(api[1]).then(
          (res) => res.json()
        );
        Hitokoto = Hitokoto.hitokoto;
        global.BotHitokoto = Hitokoto;
      } catch (error) {
        logger.info(logger.blue(`全局随机一言获取失败`));
        global.BotHitokoto = '';
      }
    } 
  }
})();
