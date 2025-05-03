import fs from "node:fs";
import Init from "./init/init.js";
import { GetConfig, _PATH, PluginName_en, PluginName_zh } from "./function/function.js";
import chalk from 'chalk'
let { config} =  GetConfig(`defSet`, `system`);
let Pluginloadingconsolecharacterdrawingswitch = config.Pluginloadingconsolecharacterdrawingswitch;

const startTime = Date.now()
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
let successCount = 0
let failureCount = 0

for (let i in files) {
  let name = files[i].replace(".js", "");

  if (ret[i].status != "fulfilled") {
    logger.error(`载入插件错误：${logger.red(name)}`);
    logger.error(ret[i].reason);
    failureCount++;
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
  successCount++;
}

logger.info(chalk.cyan('---------ヾ(✿ﾟ▽ﾟ)ノ---------'));
logger.info(chalk.white(`${PluginName_zh}载入中！`));
logger.info(chalk.cyan('-----------------------------'));
if (Pluginloadingconsolecharacterdrawingswitch) {
logger.error(chalk.red(`如果你回来看了那么你被骗了${chalk.yellow(`来自:${PluginName_zh}`)}`))
logger.error(chalk.red(" ......................阿弥陀佛......................\n"+
  "                       _oo0oo_                      \n"+
  "                      o8888888o                     \n"+
  "                      88\" . \"88                     \n"+
  "                      (| -_- |)                     \n"+
  "                      0\\  =  /0                     \n"+
  "                   ___/‘---’\\___                   \n"+
  "                  .' \\|       |/ '.                 \n"+
  "                 / \\\\|||  :  |||// \\                \n"+
  "                / _||||| -卍-|||||_ \\               \n"+
  "               |   | \\\\\\  -  /// |   |              \n"+
  "               | \\_|  ''\\---/''  |_/ |              \n"+
  "               \\  .-\\__  '-'  ___/-. /              \n"+
  "             ___'. .'  /--.--\\  '. .'___            \n"+
  "         .\"\" ‘<  ‘.___\\_<|>_/___.’>’ \"\".          \n"+
  "       | | :  ‘- \\‘.;‘\\ _ /’;.’/ - ’ : | |        \n"+
  "         \\  \\ ‘_.   \\_ __\\ /__ _/   .-’ /  /        \n"+
  "    =====‘-.____‘.___ \\_____/___.-’___.-’=====     \n"+
  "                       ‘=---=’                      \n"+
  "                                                    \n"+
  "....................佛祖保佑 ,永无BUG..................."));
}

const endTime = Date.now()
const elapsedTime = endTime - startTime

logger.info(chalk.cyan('-------------------'))
logger.info(chalk.green(`${PluginName_zh}插件载入完成`))
logger.info(`成功加载：${chalk.green(successCount)} 个`)
logger.info(`加载失败：${chalk.red(failureCount)} 个`)
logger.info(`总耗时：${chalk.yellow(elapsedTime)} 毫秒`)
logger.info(chalk.green(`Created By ` + PluginAuthor));
logger.info(chalk.cyan('-------------------'))

if (Pluginloadingconsolecharacterdrawingswitch) {
logger.error(chalk.red(`
  * _ooOoo_
  * o8888888o
  * 88" . "88
  * (| -_- |)
  *  O\\ = /O
  * ___/\\'---'\\____
  * .   ' \\\\| |// \`.
  * / \\\\||| : |||// \\
  * / _||||| -:- |||||- \\
  * | | \\\\\\ - /// | |
  * | \\_| ''\\---/'' | |
  * \\ .-\\__ \`-\` ___/-. /
  * ___\`. .' /--.--\\ \`. . __
  * ."" '< \`.___\\_<|>_/___.' >'""
  * | | : \`- \\\`.;\\\`\\ _ /\\\`;.\`/ - \` : | |
  * \\ \\ \`-. \\_ __\\ /__ _/ .-\` / /
  * ======\`-.____\`-.___\\_____/___.-\`____.-'======
  * \`=---='
  *          .............................................
  *           佛曰：bug泛滥，我已瘫痪！
 `))
}

export { apps };
