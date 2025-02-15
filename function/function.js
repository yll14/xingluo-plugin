import fetch from "node-fetch";
import yaml from "yaml";
import fs from "fs";
const _PATH = process.cwd().replace(/\\/g, "/");
const PluginName_zh = "星落插件";
const PluginName_en = "xingluo-plugin";
const PluginPath = `${_PATH}/plugins/${PluginName_en}`;
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import cfg from "../../../lib/config/config.js";

/**
 * 解析配置文件
 * @param {*} file 配置文件夹
 * @param {*} name 配置文件名
 * @returns
 */
function GetConfig(file, name) {
  try {
    let cfgyaml = `${_PATH}/plugins/${PluginName_en}/${file}/${name}.yaml`;
    const configData = fs.readFileSync(cfgyaml, "utf8");
    let config = yaml.parse(configData);
    return { config };
  } catch (error) {
    console.error(`Error reading or parsing config file: ${error.message}`);
    return { config: null };
  }
}

/**
 * 保存配置文件
 * @param {*} name 配置文件名
 * @param {*} config 配置对象
 */
function saveConfig(name, config) {
  const configFilePath = `${PluginPath}/config/${name}.yaml`;
  const yamlContent = yaml.stringify(config);
  fs.writeFileSync(configFilePath, yamlContent, 'utf8');
}

/**
 * 浏览器截图
 * @param {*} e E
 * @param {*} file html模板名称
 * @param {*} name
 * @param {object} obj 渲染变量，类型为对象
 * @returns
 */
async function image(e, file, name, obj) {
  let botname = cfg.package.name;
  if (cfg.package.name == `yunzai`) {
    botname = `Yunzai-Bot`;
  } else if (cfg.package.name == `miao-yunzai`) {
    botname = `Miao-Yunzai`;
  } else if (cfg.package.name == `trss-yunzai`) {
    botname = `TRSS-Yunzai`;
  } else if (cfg.package.name == `a-yunzai`) {
    botname = `A-Yunzai`;
  } else if (cfg.package.name == `biscuit-yunzai`) {
    botname = `Biscuit-Yunzai`;
  }
  let data = {
    quality: 100,
    tplFile: `./plugins/${PluginName_en}/resources/html/${file}.html`,
    ...obj,
  };
  let img = await puppeteer.screenshot(name, {
    botname,
    MiaoV: cfg.package.version,
    ...data,
  });

  return {
    img,
  };
}


export {
  _PATH,
  PluginName_zh,
  PluginName_en,
  PluginPath,
  GetConfig,
  saveConfig,
  image,
};
