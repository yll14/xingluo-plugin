import yaml from "yaml";
import fs from "node:fs";
import { _PATH, PluginName_en, PluginPath } from "../function/function.js";

export default new (class Init {
  async init() {
    try {
      await this.loadConfig();
      await this.globalVersion();
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
    const configFilePath = `${configFolder}/config.yaml`;
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

    const updatetaskFilePath = `${configFolder}/updatetask.yaml`;
    const defUpdatetaskFilePath = `${defSetFolder}/updatetask.yaml`;
    if (!fs.existsSync(updatetaskFilePath)) {
      fs.copyFileSync(defUpdatetaskFilePath, updatetaskFilePath);
    }

    /*
        if(!fs.existsSync(`./plugins/${PluginName_en}/config/fishText.yaml`)) {
          fs.copyFileSync(`./plugins/${PluginName_en}/defSet/fishText.yaml`, `./plugins/${PluginName_en}/config/fishText.yaml`)
        } else {
          let config = yaml.parse(fs.readFileSync(`./plugins/${PluginName_en}/config/fishText.yaml`, `utf-8`))
          let configNT = config.nothingText || []
          config = config.fishText
          let defcfg = yaml.parse(fs.readFileSync(`./plugins/${PluginName_en}/defSet/fishText.yaml`, `utf-8`))
          let defcfgNT = defcfg.nothingText
          defcfg = defcfg.fishText
          fs.writeFileSync(`./plugins/${PluginName_en}/config/fishText.yaml`, yaml.stringify({ fishText: [...new Set(config.concat(defcfg))], nothingText: [...new Set(configNT.concat(defcfgNT))] }), `utf-8`)
        }*/
  }
  async globalVersion() {
    let PluginVersion = JSON.parse(
      fs.readFileSync(`./plugins/${PluginName_en}/package.json`, `utf-8`),
    );
    PluginVersion = PluginVersion.version;
    global.PluginVersion = PluginVersion;
  }
})();
