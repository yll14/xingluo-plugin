import { GetConfig, PluginName_zh } from "../function/function.js";

export class Memes extends plugin {
  constructor() {
    super({
      name: `${PluginName_zh}表情包`,
      dsc: `${PluginName_zh}表情包`,
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: /^#?随机(.*)表情包$/,
          fnc: "Memes",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?表情包设置(.*)$/i,
          fnc: "Setting",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看表情包配置$/i,
          fnc: "ViewConfig",
        },
      ],
    });
  }

  async Memes(e) {
    const { config } = GetConfig(`config`, `Memes`);
    if (!config.switch) {
      return e.reply(`该功能已关闭`);
    }

    const type = e.msg.match(/^#?随机(.*)表情包$/)[1];
    const validTypes = new Set([
      "甘城",
      "猫羽雫",
      "甘城猫猫",
      "fufu",
      "丛雨",
      "小南梁",
      "千恋万花",
      "古拉",
      "心海",
      "柴郡猫",
      "满穗",
      "猫猫虫",
      "纳西妲",
      "诗歌剧",
      "龙图",
      "kemomimi",
      "",
    ]);

    if (!validTypes.has(type)) {
      return e.reply(
        `没有${type}的表情包诶!您可以使用'#星落表情包'来查看拥有的表情包哦~`,
      );
    }

    const getApiUrl = (name) => config.api[0] + `?name=${name}`;
    const api =
      type === ""
        ? config.api[1]
        : getApiUrl(
            type === "甘城" || type === "猫羽雫" || type === "甘城猫猫"
              ? "甘城猫猫"
              : type,
          );

    return await e.reply(segment.image(api));
  }
  async Setting(e) {
    const { config } = GetConfig(`config`, `Memes`);
    const match = e.msg.match(/(开启|关闭)\s*(.*)/);
    if (!match) {
      return e.reply("命令格式错误或未匹配");
    }

    const action = match[1];
    if (action === "开启" || action === "关闭") {
      const type = action === "开启";
      config.switch = type;
      e.reply(`功能已${type ? "开启" : "关闭"}`);
    }
    try {
      saveConfig("Memes", config);
    } catch (error) {
      return e.reply("更新配置失败，请稍后再试");
    }
  }
  async ViewConfig(e) {
    const { config } = GetConfig(`config`, `Memes`);
    e.reply(`表情包配置:\n状态: ${config.switch ? "开启" : "关闭"}`);
  }
}
