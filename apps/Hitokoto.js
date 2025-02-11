import fetch from "node-fetch";
import { GetConfig, PluginName_zh } from "../function/function.js";
const { config } = GetConfig(`config`, `Hitokoto`);

export class Hitokoto extends plugin {
  constructor() {
    super({
      name: `${PluginName_zh}一言`,
      dsc: "Hitokoto",
      event: "message",
      priority: 5000,

      rule: [
        {
          reg: /^[#/]?(一言|Hitokoto)$/i,
          fnc: "Hitokoto",
        },
      ],
    });
  }

  //
  async Hitokoto(e) {
    if (!config.switch) {
      return logger.info("[${PluginName_zh}]一言已关闭");
    }
    if (config.Type == "text") {
      let types = (config.sentenceType || "")
        .split(",")
        .map((type) => `c=${type}`)
        .join("&");
      let textresponse = await fetch(
        `${config.api}?encode=${config.Type}&${types}&min_length=${config.min_length}&max_length=${config.max_length}`,
      );
      let text = await textresponse.text();
      try {
        let json = JSON.parse(text);
        if (json.status) {
          e.reply(`错误码: ${json.status}\n错误信息: ${json.message}`);
        } else if (json.hitokoto) {
          e.reply(json.hitokoto);
        } else {
          e.reply("系统繁忙请稍后再试");
        }
      } catch (error) {
        e.reply(text);
      }
      return true;
    } else if (config.Type == "json") {
      let types = (config.sentenceType || "")
        .split(",")
        .map((type) => `c=${type}`)
        .join("&");
      let jsonresponse = await fetch(
        `${config.api}?encode=${config.Type}&${types}&min_length=${config.min_length}&max_length=${config.max_length}`,
      );
      let json = await jsonresponse.json();

      if (json.hitokoto) {
        e.reply(
          `ID: ${json.id}\nUUID: ${json.uuid}\n类型: ${json.type}\n句子: ${json.hitokoto}\n作者: ${json.from}\n来自: ${json.from_who || "未知"}\n创建者: ${json.creator}\n创建者UID: ${json.creator_uid}\n审核者: ${json.reviewer}\n提交来源: ${json.commit_from}\n创建时间: ${new Date(parseInt(json.created_at) * 1000).toLocaleString()}\n长度: ${json.length}`,
        );
      } else if (json.status && json.message) {
        e.reply(`错误码: ${json.status}\n错误信息: ${json.message}`);
      } else {
        e.reply("系统繁忙请稍后再试");
      }
      return true;
    }
  }
}
