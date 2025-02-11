import fetch from "node-fetch";
import { GetConfig, PluginName_zh } from "../function/function.js";

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
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?一言(.*)$/i,
          fnc: "Setting",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看句子类型$/i,
          fnc: "ViewSentenceType",
        }
      ],
    });
  }

  //
  async Hitokoto(e) {
    const { config } = GetConfig(`config`, `Hitokoto`);
    if (!config.switch) {
      return logger.info(`[${PluginName_zh}]一言已关闭`);
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
  async Setting(e) {
    const { config } = GetConfig(`config`, `Hitokoto`);
    const match = e.msg.match(/(开启|关闭|类型|最小长度|最大长度|句子类型|API地址)\s*(.*)/);
    if (!match) {
      return e.reply('命令格式错误或未匹配');
    }

    const action = match[1];
    const value = match[2].trim();

    if (action === '开启' || action === '关闭') {
      const type = action === '开启';
      config.switch = type;
      e.reply(`功能已${type ? '开启' : '关闭'}`);
    } else if (action === '类型') {
      if (!value) {
        return e.reply('请提供有效的类型');
      }
      config.Type = value;
      e.reply(`类型已更新为: ${value}`);
    } else if (action === '最小长度') {
      const minLength = parseInt(value, 10);
      if (isNaN(minLength)) {
        return e.reply('请提供有效的最小长度');
      }
      config.min_length = minLength;
      e.reply(`最小长度已更新为: ${minLength}`);
    } else if (action === '最大长度') {
      const maxLength = parseInt(value, 10);
      if (isNaN(maxLength)) {
        return e.reply('请提供有效的最大长度');
      }
      config.max_length = maxLength;
      e.reply(`最大长度已更新为: ${maxLength}`);
    } else if (action === '句子类型') {
      if (!value) {
        return e.reply('请提供有效的句子类型');
      }
      config.sentenceType = value;
      e.reply(`句子类型已更新为: ${value}`);
    } else if (action === 'API地址') {
      if (!value) {
        return e.reply('请提供有效的 API 地址');
      }
      config.api = value;
      e.reply(`API 地址已更新为: ${value}`);
    }

    saveConfig('Hitokoto', config);
  }
  async ViewSentenceType(e) {
    e.reply(`句子类型: a:动画 b:漫画 c:游戏 d:文学 e:原创 f:来自网络 g:其他 h:影视 i:诗词 j:网易云 k:哲学 l:抖机灵\n选择多种使用英文逗号连接例如'a,b,c'`);
  }
}
