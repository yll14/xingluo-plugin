import fetch from "node-fetch";
import {
  GetConfig,
  PluginName_zh,
  PluginName_en,
  image,
  _PATH,
} from "../function/function.js";

export class Hitokoto extends plugin {
  constructor() {
    super({
      name: `${PluginName_zh}每日热搜`,
      dsc: "每日热搜",
      event: "message",
      priority: 5000,

      rule: [
        {
          reg: /^[#/!]?(.*)(热搜|Hot)$/i,
          fnc: "DailyHot",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?每日热搜设置(.*)$/i,
          fnc: "Setting",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看每日热搜配置$/i,
          fnc: "ViewConfig",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看每日热搜配置$/i,
          fnc: "ViewConfig",
        },
      ],
    });
  }

  async DailyHot(e) {
    const { config } = GetConfig(`config`, `DailyHot`);
    if (!config.switch) {
      return logger.info(`[${PluginName_zh}]每日热搜已关闭`);
    }
    const routes = [
      { name: "百度", path: "/baidu" },
      { name: "B站", path: "/bilibili" },
      { name: "豆瓣", path: "/douban-movie" },
      { name: "抖音", path: "/douyin" },
      { name: "原神", path: "/genshin" },
      { name: "崩坏", path: "/honkai" },
      { name: "快手", path: "/kuaishou" },
      { name: "米游社", path: "/miyoushe" },
      { name: "网易新闻", path: "/netease-news" },
      { name: "新浪新闻", path: "/sina-news" },
      { name: "新浪", path: "/sina" },
      { name: "星铁", path: "/starrail" },
      { name: "澎湃新闻", path: "/thepaper" },
      { name: "贴吧", path: "/tieba" },
      { name: "头条", path: "/toutiao" },
      { name: "微博", path: "/weibo" },
      { name: "知乎日报", path: "/zhihu-daily" },
      { name: "知乎", path: "/zhihu" },
      { name: "腾讯新闻", path: "/qq-news" },
    ];

    const typeMatch = routes.map((r) => r.name).join("|");
    const type = e.msg.match(new RegExp(`(${typeMatch})`, "i"))
      ? e.msg.match(new RegExp(`(${typeMatch})`, "i"))[1]
      : null;
    if (!type) {
      logger.error(`[${PluginName_zh}] 未找到对应的热搜类型: ${e.msg}`);
      return e.reply(`未找到对应的热搜类型: ${e.msg}`);
    }
    const route = routes.find((r) => r.name === type);
    if (!route) {
      logger.error(`[${PluginName_zh}] 未找到对应的热搜类型: ${type}`);
      return e.reply(`未找到对应的热搜类型: ${type}`);
    }
    let api = config.api + route.path;
    const response = await fetch(api);
    const data = await response.json();
    const topItems = data.data.slice(0, 6);
    const template = topItems
      .map((item, index) => {
        let linkInfo = config.showLink ? `链接：${item.url}\n` : "";
        return `Top${index + 1}：\n标题：${item.title}\n作者：${item.author || "未知作者"}\n描述：${item.desc || "无描述"}\n${linkInfo}\n`;
      })
      .join("");
    e.reply(template);
  }
  async Setting(e) {
    const { config } = GetConfig(`config`, `DailyHot`);
    const match = e.msg.match(/(开启|关闭|API地址|显示链接)\s*(.*)/);
    if (!match) {
      return e.reply("命令格式错误或未匹配");
    }

    const action = match[1];
    const value = match[2].trim();

    if (action === "开启" || action === "关闭") {
      const type = action === "开启";
      config.switch = type;
      e.reply(`功能已${type ? "开启" : "关闭"}`);
    } else if (action === "API地址") {
      if (!value) {
        return e.reply("请提供有效的 API 地址");
      }
      config.api = value.endsWith("/") ? value.slice(0, -1) : value;
      e.reply(`API 地址已更新为: ${config.api}`);
    } else if (action === "显示链接") {
      const type = action === "开启";
      config.showLink = type;
      e.reply(`显示链接已${type ? "开启" : "关闭"}`);
    }
    try {
      saveConfig("DailyHot", config);
    } catch (error) {
      return e.reply("更新配置失败，请稍后再试");
    }
  }

  async ViewConfig(e) {
    const { config } = GetConfig(`config`, `DailyHot`);
    e.reply(
      `每日热搜配置:\n状态: ${config.switch ? "开启" : "关闭"}\nAPI地址: ${config.api}\n是否显示链接: ${config.showLink ? "是" : "否"}`,
    );
  }
}
