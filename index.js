import fs from "node:fs";
import Init from "./init/init.js";
import {
  _PATH,
  PluginName_en,
  PluginName_zh,
  Author,
} from "./function/function.js";

let initMsg = await Init.init();
if (!initMsg.boolean) {
  logger.error(logger.red(`${PluginName_zh}插件载入失败`));
  logger.error(initMsg.msg);
  throw new Error(`${PluginName_en}载入失败`);
}

if (!global.segment) {
  global.segment = (await import("oicq")).segment;
}

let ret = [];

const files = fs
  .readdirSync(`./plugins/${PluginName_en}/apps`)
  .filter((file) => file.endsWith(".js"));

files.forEach((file) => {
  ret.push(import(`./apps/${file}`));
});

ret = await Promise.allSettled(ret);

let apps = {};
for (let i in files) {
  let name = files[i].replace(".js", "");

  if (ret[i].status != "fulfilled") {
    logger.error(`载入插件错误：${logger.red(name)}`);
    logger.error(ret[i].reason);
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
}
logger.info(`---------ヾ(✿ﾟ▽ﾟ)ノ---------`);
logger.info(`${PluginName_zh}载入成功！`);
logger.info(`Created By 洛洛`);
logger.info(`-----------------------------`);
export { apps };
