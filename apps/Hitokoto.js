import fetch from "node-fetch";
import { GetConfig, PluginName_zh } from "../function/function.js";
import EventEmitter from 'events';

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
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?一言设置(.*)$/i,
          fnc: "Setting",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看一言句子类型$/i,
          fnc: "ViewSentenceType",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看一言配置$/i,
          fnc: "ViewConfig",
        }
      ],
    });

    this.eventEmitter = new EventEmitter();
    this.isAwaitingTemplate = false;
  }

  //
  async Hitokoto(e) {
    const { config } = GetConfig(`config`, `Hitokoto`);

    if (!config.switch) {
      return logger.info(`[${PluginName_zh}]一言已关闭`);
    }

    const templateToUse = config.templateswitch && config.customize
      ? config.customize
      : config.default;

    if (this.isAwaitingTemplate) {
      if (e.msg === '取消') {
        this.isAwaitingTemplate = false;
        return e.reply('自定义模板修改已取消。');
      } else {
        await e.reply(`您发送的自定义模板是：\n${e.msg}\n\n请确认是否进行修改？（发送'确认'以确认，发送'取消'以取消）`);
        this.isAwaitingTemplate = false;
      }
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
          `${templateToUse.replace('${json.id}', json.id)
                           .replace('${json.uuid}', json.uuid)
                           .replace('${json.type}', json.type)
                           .replace('${json.hitokoto}', json.hitokoto)
                           .replace('${json.from}', json.from)
                           .replace('${json.from_who}', json.from_who || "未知")
                           .replace('${json.creator}', json.creator)
                           .replace('${json.creator_uid}', json.creator_uid)
                           .replace('${json.reviewer}', json.reviewer)
                           .replace('${json.commit_from}', json.commit_from)
                           .replace('${time}', new Date(parseInt(json.created_at) * 1000).toLocaleString())
                           .replace('${json.length}', json.length)}`,
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
    const match = e.msg.match(/(开启|关闭|类型|最小长度|最大长度|句子类型|API地址|自定义模板)\s*(.*)/);
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
    } else if (action === '自定义模板') {
      this.isAwaitingTemplate = true;
      await e.reply(`请发送自定义模板，模板内容请参考以下格式：\nID: ${json.id}\nUUID: ${json.uuid}\n类型: ${json.type}\n句子: ${json.hitokoto}\n作者: ${json.from}\n来自: ${json.from_who}\n创建者: ${json.creator}\n创建者UID: ${json.creator_uid}\n审核者: ${json.reviewer}\n提交来源: ${json.commit_from}\n创建时间: ${time}\n长度: ${json.length}\n\n发送'取消'以取消修改。`);
    } else {
      return e.reply('未识别的命令');
    }
    try {
      saveConfig('Hitokoto', config);
    } catch (error) {
      return e.reply('更新配置失败，请稍后再试');
    }
  }
  async ViewSentenceType(e) {
    e.reply(`句子类型: a:动画 b:漫画 c:游戏 d:文学 e:原创 f:来自网络 g:其他 h:影视 i:诗词 j:网易云 k:哲学 l:抖机灵\n选择多种使用英文逗号连接例如'a,b,c'`);
  }
  async ViewConfig(e) {
    const { config } = GetConfig(`config`, `Hitokoto`);
    e.reply(`一言配置:\n状态: ${config.switch ? '开启' : '关闭'}\n类型: ${config.Type}\n最小长度: ${config.min_length}\n最大长度: ${config.max_length}\n句子类型: ${config.sentenceType ? config.sentenceType : '全部类型'}\nAPI地址: ${config.api}\n是否开启自定义模板: ${config.templateswitch ? '是' : '否'}\n自定义模板: ${config.customize || '未设置'}`);
  }
}
