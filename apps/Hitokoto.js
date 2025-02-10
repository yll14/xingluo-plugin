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
    if ((config.Type = "text")) {
      let types = (config.sentenceType || "")
        .split(",")
        .map((type) => `c=${type}`)
        .join("&");
      let textresponse = await fetch(
        `${config.api}?encode=${config.apiType}&${types}`,
      );
      let text = await textresponse.text();
      e.reply(text);
      return true;
    } else if ((config.Type = "json")) {
      let types = (config.sentenceType || "")
        .split(",")
        .map((type) => `c=${type}`)
        .join("&");
      let jsonresponse = await fetch(
        `${config.api}?encode=${config.apiType}&${types}`,
      );
      let msg = await jsonresponse.json();
      let templateMessage = `
            ID: ${msg.id}\n  
            UUID: ${msg.uuid}\n
            类型: ${msg.type}\n
            句子: ${msg.hitokoto}\n
            作者: ${msg.from}\n
            来自: ${msg.from_who || "未知"}\n
            创建者: ${msg.creator}\n
            创建者UID: ${msg.creator_uid}\n
            审核者: ${msg.reviewer}\n
            提交来源: ${msg.commit_from}\n
            创建时间: ${new Date(parseInt(msg.created_at) * 1000).toLocaleString()}\n
            长度: ${msg.length}\n
            `;
      e.reply(templateMessage);
      return true;
    }
  }
}
