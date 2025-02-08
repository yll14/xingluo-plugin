import fetch from "node-fetch";
import yaml from "yaml";
import fs from "fs";
const _PATH = process.cwd().replace(/\\/g, "/");
const PluginName_zh = "星洛插件";
const PluginName_en = "xingluo-plugin";
const PluginPath = `${_PATH}/plugins/${PluginName_en}`;
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import cfg from "../../../lib/config/config.js";

const DATA = await fetch("https://web.yll14.cn/?type=json").then((response) =>
  response.json(),
);

/**
 * 获取服务器状态
 * @param {*} e
 * @returns
 */
async function Server_Status(e) {
  if (DATA.code === 200) {
    //console.log('[LL]服务器运行正常');
    return false;
  } else {
    return ReturnInformation(DATA, e);
  }
}

/**
 * 获取公告信息
 * @param {*} e
 * @returns
 */
async function ReadMessage(e) {
  if (DATA.code === 200) {
    // console.log('[LL]获取到公告信息');
    console.log(`[LL]获取到公告信息:` + DATA.message);
    if (DATA.Other.push === "true") {
      console.log(
        `[LL]公告推送状态为` +
          DATA.Other.push +
          `开始推送公告信息:` +
          DATA.message,
      );
      e.reply(DATA.message);
      return true;
    } else {
      console.log(`[LL]公告推送状态为` + DATA.Other.push + `取消推送公告信息`);
    }
    return true;
  } else {
    return ReturnInformation(DATA, e);
  }
}

/**
 * 解析配置文件
 * @param {*} file 配置文件夹
 * @param {*} name 配置文件名
 * @returns
 */
function GetConfig(file, name) {
  let cfgyaml = `${_PATH}/plugins/${PluginName_en}/${file}/${name}.yaml`;
  const configData = fs.readFileSync(cfgyaml, "utf8");
  let config = yaml.parse(configData);
  return { config };
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

/**
 * 返回错误信息
 * @param {*} Data
 * @param {*} e
 * @returns
 */
function ReturnInformation(Data, e) {
  let CODE = Data.hasOwnProperty("code") ? Data.code : "未知";
  let SERVERCONDITION = Data.hasOwnProperty("server_condition")
    ? Data.server_condition
    : "未知";
  let INFORMATION = `ERROR:服务器访问错误\n当前服务器状态：\n状态码: ${CODE}\n状态信息: ${SERVERCONDITION}`;
  console.log(INFORMATION);
  e.reply(INFORMATION);
  return true;
}

export {
  _PATH,
  PluginName_zh,
  PluginName_en,
  PluginPath,
  Server_Status,
  ReadMessage,
  GetConfig,
  image,
};
