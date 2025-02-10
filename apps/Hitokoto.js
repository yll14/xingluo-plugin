import fetch from 'node-fetch'
import {
    GetConfig,
    PluginName_zh
} from "../function/function.js";
const { config } = GetConfig(`config`, `Hitokoto`);


export class Hitokoto extends plugin {
    constructor() {
        super({
            name: `${PluginName_zh}一言`,
            dsc: 'Hitokoto',
            event: 'message',
            priority: 5000,


            rule: [
                {
                    reg: /^[#/]?(一言|Hitokoto)$/i,
                    fnc: 'Hitokoto'
                }


            ]
        })
    }

    //
    async Hitokoto(e) {
        if (!config.switch) {
            return logger.info('[${PluginName_zh}]一言已关闭')
        }
        if (config.Type = 'text') {
            let textresponse = await fetch(config.api + '?encode=' + config.apiType + '&c=' + config.sentenceType)
            let text = await textresponse.text()
            e.reply(text, true)
            return true
        } else if (config.Type = 'json') {
            let jsonresponse = await fetch(config.api + '?encode=' + config.apiType + '&c=' + config.sentenceType)
            let json = await jsonresponse.json()
            let msg = `[
            ID: ${json.id}\n  
            UUID: ${json.uuid}\n
            类型: ${json.type}\n
            句子: ${json.hitokoto}\n
            作者: ${json.from}\n
            来自: ${json.from_who || '未知'}\n
            创建者: ${json.creator}\n
            创建者UID: ${json.creator_uid}\n
            审核者: ${json.reviewer}\n
            提交来源: ${json.commit_from}\n
            创建时间: ${new Date(parseInt(json.created_at) * 1000).toLocaleString()}\n
            长度: ${json.length}\n
            ]`
            e.reply(msg, true)
            return true
        }
    }
}
