import fs from "node:fs";
import Init from "./init/init.js";
import { GetConfig, _PATH, PluginName_en, PluginName_zh } from "./function/function.js";
import chalk from 'chalk'
let { config } = GetConfig(`defSet/system`, `system`);
let PluginloadingconsolecharacterdrawingswitchDONE = config.Pluginloadingconsolecharacterdrawingswitch[0];
let PluginloadingconsolecharacterdrawingswitchERROR = config.Pluginloadingconsolecharacterdrawingswitch[1];
const startTime = Date.now()
let initMsg = await Init.init();
logger.info(chalk.cyan('---------ヾ(✿ﾟ▽ﾟ)ノ---------'));
logger.info(chalk.white(`${PluginName_zh}载入中！`));
logger.info(chalk.cyan(`一言:${BotHitokoto}`));
logger.info(chalk.cyan('-----------------------------'));
let then = 0;

if (!initMsg.boolean) {
  if (PluginloadingconsolecharacterdrawingswitchERROR) {
  logger.error(logger.red(`${PluginName_zh}插件载入失败`));
  logger.error(initMsg.msg);
  logger.error(chalk.red("  * _ooOoo_"));
  logger.error(chalk.red("  * o8888888o"));
  logger.error(chalk.red("  * 88\" . \"88"));
  logger.error(chalk.red("  * (| -_- |)"));
  logger.error(chalk.red("  *  O\\ = /O"));
  logger.error(chalk.red("  * ___/\\'---'\\____"));
  logger.error(chalk.red("  * .   ' \\\\| |// \`."));
  logger.error(chalk.red("  * / \\\\||| : |||// \\"));
  logger.error(chalk.red("  * / _||||| -:- |||||- \\"));
  logger.error(chalk.red("  * | | \\\\\\ - /// | |"));
  logger.error(chalk.red("  * | \\_| ''\\---/'' | |"));
  logger.error(chalk.red("  * \\ .-\\__ \`-\` ___/-. /"));
  logger.error(chalk.red("  * ___\`. .' /--.--\\ \`. . __"));
  logger.error(chalk.red("  * .\"\" '< \`.___\\_<|>_/___.' >'\"\""));
  logger.error(chalk.red("  * | | : \`- \\\`.;\\\`\\ _ /\\\`;.\`/ - \` : | |"));
  logger.error(chalk.red("  * \\ \\ \`-. \\_ __\\ /__ _/ .-\` / /"));
  logger.error(chalk.red("  * ======\`-.____\`-.___\\_____/___.-\`____.-'======"));
  logger.error(chalk.red("  * \`=---='"));
  logger.error(chalk.red("  *          ............................................."));
  logger.error(chalk.red("  *           佛曰：bug泛滥，我已瘫痪！"));
  then = 1;
  } 
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
    if (then && PluginloadingconsolecharacterdrawingswitchERROR) {
      logger.error(`载入插件错误：${logger.red(name)}`);
      logger.error(ret[i].reason);
      logger.warn(chalk.red("  * _ooOoo_"));
      logger.warn(chalk.red("  * o8888888o"));
      logger.warn(chalk.red("  * 88\" . \"88"));
      logger.warn(chalk.red("  * (| -_- |)"));
      logger.warn(chalk.red("  *  O\\ = /O"));
      logger.warn(chalk.red("  * ___/\\'---'\\____"));
      logger.warn(chalk.red("  * .   ' \\\\| |// \`."));
      logger.warn(chalk.red("  * / \\\\||| : |||// \\"));
      logger.warn(chalk.red("  * / _||||| -:- |||||- \\"));
      logger.warn(chalk.red("  * | | \\\\\\ - /// | |"));
      logger.warn(chalk.red("  * | \\_| ''\\---/'' | |"));
      logger.warn(chalk.red("  * \\ .-\\__ \`-\` ___/-. /"));
      logger.warn(chalk.red("  * ___\`. .' /--.--\\ \`. . __"));
      logger.warn(chalk.red("  * .\"\" '< \`.___\\_<|>_/___.' >'\"\""));
      logger.warn(chalk.red("  * | | : \`- \\\`.;\\\`\\ _ /\\\`;.\`/ - \` : | |"));
      logger.warn(chalk.red("  * \\ \\ \`-. \\_ __\\ /__ _/ .-\` / /"));
      logger.warn(chalk.red("  * ======\`-.____\`-.___\\_____/___.-\`____.-'======"));
      logger.warn(chalk.red("  * \`=---='"));
      logger.warn(chalk.red("  *          ............................................."));
      logger.warn(chalk.red("  *           佛曰：bug泛滥，我已瘫痪！"));
    }
    failureCount++;
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
  successCount++;
}

if (initMsg.boolean && ret[i].status =="fulfilled" && PluginloadingconsolecharacterdrawingswitchDONE) {
  logger.warn(chalk.red(" ......................阿弥陀佛......................"));
  logger.warn(chalk.red("                       _oo0oo_                      "));
  logger.warn(chalk.red("                      o8888888o                     "));
  logger.warn(chalk.red("                      88\" . \"88                     "));
  logger.warn(chalk.red("                      (| -_- |)                     "));
  logger.warn(chalk.red("                      0\\  =  /0                     "));
  logger.warn(chalk.red("                   ___/‘---’\\___                   "));
  logger.warn(chalk.red("                  .' \\|       |/ '.                 "));
  logger.warn(chalk.red("                 / \\\\|||  :  |||// \\                "));
  logger.warn(chalk.red("                / _||||| -卍-|||||_ \\               "));
  logger.warn(chalk.red("               |   | \\\\\\  -  /// |   |              "));
  logger.warn(chalk.red("               | \\_|  ''\\---/''  |_/ |              "));
  logger.warn(chalk.red("               \\  .-\\__  '-'  ___/-. /              "));
  logger.warn(chalk.red("             ___'. .'  /--.--\\  '. .'___            "));
  logger.warn(chalk.red("         .\"\"  ' <  '.___\\_<|>_/___.' >'\"\".          "));
  logger.warn(chalk.red("       | | :  ' - \\'.;'\\ _ /';.'' -  ' : | |        "));
  logger.warn(chalk.red("         \\  \\  '_.   \\_ __\\ /__ _/   .-'' /  /        "));
  logger.warn(chalk.red("    ====='-.____'.___ \\_____/___.-''___.-''=====     "));
  logger.warn(chalk.red("                       '=---='                      "));
  logger.warn(chalk.red("                                                    "));
  logger.warn(chalk.red("....................佛祖保佑 ,永无BUG..................."));
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

export { apps };
