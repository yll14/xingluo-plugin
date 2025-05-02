import Data from "./Data.js";
import { PluginName_en, PluginName_zh } from "./function.js";
import Version from "./Version.js";
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import fs from "fs";

const _path = process.cwd();
export default async function (path, params, cfg) {
  let [app, tpl] = path.split("/");
  let { e } = cfg;
  let layoutPath =
    process.cwd() + `/plugins/${PluginName_en}/resources/common/layout/`;
  let resPath = `../../../../../plugins/${PluginName_en}/resources/`;
  Data.createDir(`data/html/${PluginName_en}/${app}/${tpl}`, "root");
  let data = {
    ...params,
    _plugin: PluginName_en,
    saveId: params.saveId || params.save_id || tpl,
    tplFile: `./plugins/${PluginName_en}/resources/${app}/${tpl}.html`,
    pluResPath: resPath,
    _res_path: resPath,
    _layout_path: layoutPath,
    _tpl_path:
      process.cwd() + `/plugins/${PluginName_en}/resources/common/tpl/`,
    defaultLayout: layoutPath + "default.html",
    elemLayout: layoutPath + "elem.html",
    pageGotoParams: {
      waitUntil: "networkidle0",
    },
    sys: {
      scale: `style=transform:scale(${cfg.scale || 1})`,
      copyright: `Yunzai-Bot<span class="version">${Version.yunzai}</span> & ${PluginName_zh}<span class="version">${PluginVersion}</span>&
        ${PluginAuthor}`,
    },
    quality: 100,
  };
  if (process.argv.includes("web-debug")) {
    let saveDir = _path + "/data/ViewData/";
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir);
    }
    let file = saveDir + tpl + ".json";
    data._app = app;
    fs.writeFileSync(file, JSON.stringify(data));
  }
  let base64 = await puppeteer.screenshot(
    `${PluginName_en}/${app}/${tpl}`,
    data,
  );
  let ret = true;
  if (base64) {
    ret = await e.reply(base64);
  }
  return cfg.retMsgId ? ret : true;
}
