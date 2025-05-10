import { exec } from "child_process";
import {
  PluginName_en,
  PluginName_zh,
  GetConfig,
  saveConfig,
} from "../function/function.js";
import iconv from "iconv-lite";
import os from "os";

export class Ping extends plugin {
  constructor() {
    super({
      name: `[${PluginName_en}]Ping`,
      dsc: `[${PluginName_zh}]本地Ping`,
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: /^[#/!]?ping(.*)$/i,
          fnc: "Ping",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?ping设置(.*)$/i,
          fnc: "Setting",
          permission: "master",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看ping配置$/i,
          fnc: "ViewConfig",
          permission: "master",
        },
      ],
    });
  }

  async Ping(e) {
    const { config } = GetConfig(`config`, `Ping`);
    if (!config.switch) {
      return logger.info(`[${PluginName_zh}]Ping已关闭`);
    }

    const msg = e.msg.match(/^[#/!]?ping(.*)$/i)[1].trim();
    if (!msg) {
      e.reply("请提供一个有效的IP地址或域名");
      return false;
    }

    if (config.Networknodes) {
      try {
        const results = await this.fetchPingData(config, msg);
        const combinedResults = results.join("\n\n");
        e.reply(combinedResults);
      } catch (error) {
        logger.error(`API请求出错: ${error.message}`);
        e.reply("无法连接到API，请稍后再试");
      }
    } else {
      try {
        const pingResult = await this.runPingCommand(msg);
        e.reply(pingResult);
      } catch (err) {
        logger.error(`Ping操作出错: ${err.message}`);
        e.reply("Ping失败，请检查IP地址或域名是否正确");
      }
    }

    return true;
  }

  async Setting(e) {
    const { config } = GetConfig(`config`, `Ping`);
    const match = e.msg.match(/(开启|关闭|显示输出|使用节点)\s*(.*)/);
    if (!match) {
      return e.reply("命令格式错误或未匹配");
    }

    const action = match[1];
    const value = match[2].trim();

    if (action === "开启" || action === "关闭") {
      const type = action === "开启";
      config.switch = type;
      e.reply(`功能已${type ? "开启" : "关闭"}`);
    } else if (action === "显示输出") {
      const type = value === "开启";
      config.output = type;
      e.reply(`显示输出已${type ? "开启" : "关闭"}`);
    } else if (action === "使用节点") {
      const type = value === "开启";
      config.useNetworknodes = type;
      e.reply(`使用节点已${type ? "开启" : "关闭"}`);
    }
    try {
      saveConfig("Ping", config);
    } catch (error) {
      logger.error(error);
      return e.reply(`更新配置失败，请稍后再试\n错误信息:${error}`);
    }
  }

  async ViewConfig(e) {
    const { config } = GetConfig(`config`, `Ping`);
    e.reply(
      `Ping配置:\n状态: ${config.switch ? "开启" : "关闭"}\nAPI地址: ${config.api}\n是否显示链接: ${config.showLink ? "是" : "否"}`,
    );
  }

  async fetchPingData(config, msg) {
    const nodeIndices = config.useNetworknodes
      ? [0, 1]
      : [config.node === "a" ? 0 : 1];
    const requests = nodeIndices.map((index) =>
      fetch(`${config.api[index]}/ping?host=${msg}`),
    );
    const responses = await Promise.all(requests);
    const results = await Promise.all(
      responses.map(async (response, index) => {
        const data = await response.json();
        const output = data.data.output;
        const formattedOutput = config.output
          ? output
              .split("\n")
              .map((line) => line.trim())
              .join("\n")
          : "";
        if (response.status === 400) {
          return `节点：${data.node}\nError_en:${data.error.error_en}\nError_zh:${data.error.error_zh}`;
        } else if (response.status === 500) {
          return `节点：${data.node}\nError_en:${data.error.error_en}\nError_zh:${data.error.error_zh}\n输出：\n${formattedOutput}`;
        }
        return `节点：${data.data.node}\n延迟：${data.data.avgLatency}\n丢包率：${data.data.packetLossRate}${formattedOutput ? `\n输出：\n${formattedOutput}` : ""}`;
      }),
    );
    return results;
  }

  runPingCommand(address) {
    const platform = os.platform();
    const pingCommand =
      platform === "win32" ? `ping -n 4 ${address}` : `ping -c 4 ${address}`;

    return new Promise((resolve, reject) => {
      exec(pingCommand, { encoding: "buffer" }, (error, stdout, stderr) => {
        if (error) {
          const errorMessage = iconv.decode(
            stderr || Buffer.from(error.message),
            "gbk",
          );
          reject(new Error(errorMessage));
          return;
        }
        const output = iconv.decode(
          stdout,
          platform === "win32" ? "gbk" : "utf-8",
        );
        resolve(output);
      });
    });
  }
}
