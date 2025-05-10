import moment from "moment";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { GetConfig, PluginName_zh } from "../function/function.js";

Bot.on("message.group", async (e) => {
  const { config } = GetConfig(`config`, `whoAtme`);
  const IMAGE_SAVE_PATH = path.resolve(`${config.cachePath}`);
  if (!fs.existsSync(path.resolve(`${config.cachePath}`))) {
    fs.mkdirSync(IMAGE_SAVE_PATH, { recursive: true });
  }
  let time = config.cacheTime;

  let imgUrls = [];
  let imgLocalPaths = [];
  let AtQQ = [];
  for (let msg of e.message) {
    if (msg.type == "at") {
      AtQQ.push(msg.qq);
    }
    if (msg.type == "image" && AtQQ.length > 0) {
      imgUrls.push(msg.url);
      try {
        const { config } = GetConfig(`config`, `whoAtme`);
        if (!config.cacheImage) {
          logger.info(
            logger.blue(`[${PluginName_zh}]图片缓存已关闭，跳过本地保存`),
          );
          continue;
        }
        let res = await fetch(msg.url);
        if (res.ok) {
          let ext = path.extname(msg.url).split("?")[0] || ".jpg";
          let fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
          let filePath = path.join(IMAGE_SAVE_PATH, fileName);
          let dest = fs.createWriteStream(filePath);
          if (res.body && res.body.pipe) {
            await pipeline(res.body, dest);
            logger.info(
              logger.green(`[${PluginName_zh}]图片已保存到: ${filePath}`),
            );
          } else if (res.body && res.body.getReader) {
            const webStream = Readable.fromWeb(res.body);
            await pipeline(webStream, dest);
            logger.info(
              logger.green(`[${PluginName_zh}]图片已保存到: ${filePath}`),
            );
          } else {
            throw new Error("未知的 res.body 类型");
          }
          imgLocalPaths.push(filePath);

          let expireSeconds = time * 60 * 60;
          await redis.set(`Yz:whoAtme:img:${fileName}`, filePath, {
            EX: expireSeconds,
          });
        } else {
          logger.error(
            logger.red(`[${PluginName_zh}]图片下载失败，状态码:${res.status}`),
          );
        }
      } catch (err) {
        logger.error(logger.red(`[${PluginName_zh}]图片下载失败`, err));
      }
    }
  }

  if (!AtQQ.length) return false;

  let dateTime = moment(Date.now())
    .add(time, "hours")
    .format("YYYY-MM-DD HH:mm:ss");
  let new_date = (new Date(dateTime).getTime() - new Date().getTime()) / 1000;
  let redis_data;
  let reply;
  let data;
  let atName;
  e.raw_message = e.raw_message.replace(/\[(.*?)\]/g, "").trim();
  if (e.atall) {
    let groupMember = [];
    let gm = await e.group.getMemberMap();
    for (let i of gm) {
      groupMember.push(i[0]);
    }
    AtQQ = groupMember;
  }
  for (let i = 0; i < AtQQ.length; i++) {
    data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}_${AtQQ[i]}`));
    if (e.source) {
      reply = (await e.group.getChatHistory(e.source.seq, 1)).pop();
      atName = e.raw_message.split(" ");
      e.raw_message = e.raw_message.replace(new RegExp(atName[0], "g"), "");
    }
    if (data) {
      redis_data = {
        User: e.user_id,
        message: e.raw_message,
        image: imgUrls,
        imageLocal: imgLocalPaths,
        name: e.member.card || e.member.nickname,
        time: e.time,
        messageId: reply ? reply.message_id : "",
      };

      data.push(redis_data);

      new_date =
        (new Date(data[0].endTime).getTime() - new Date().getTime()) / 1000;
      await redis.set(
        `Yz:whoAtme:${e.group_id}_${AtQQ[i]}`,
        JSON.stringify(data),
        {
          EX: parseInt(new_date),
        },
      );

      continue;
    }

    redis_data = [
      {
        User: e.user_id,
        message: e.raw_message,
        image: imgUrls,
        imageLocal: imgLocalPaths,
        name: e.member.card || e.member.nickname,
        time: e.time,
        endTime: dateTime,
        messageId: reply ? reply.message_id : "",
      },
    ];

    await redis.set(
      `Yz:whoAtme:${e.group_id}_${AtQQ[i]}`,
      JSON.stringify(redis_data),
      {
        EX: parseInt(new_date),
      },
    );
  }
});

setInterval(async () => {
  const { config } = GetConfig(`config`, `whoAtme`);
  const IMAGE_SAVE_PATH = path.resolve(`${config.cachePath}`);
  let keys = await redis.keys("Yz:whoAtme:img:*");
  let fileSet = new Set();
  for (let key of keys) {
    let filePath = await redis.get(key);
    if (filePath) {
      fileSet.add(filePath);
    }
  }

  let files = fs.readdirSync(IMAGE_SAVE_PATH);
  for (let file of files) {
    let filePath = path.join(IMAGE_SAVE_PATH, file);
    if (!fileSet.has(filePath)) {
      try {
        fs.unlinkSync(filePath);
        logger.info(
          logger.green(`[${PluginName_zh}]已删除过期图片: ${filePath}`),
        );
      } catch (e) {}
    }
  }
}, 60 * 1000);
export class whoAtme extends plugin {
  constructor() {
    super({
      name: "谁艾特我",
      dsc: "看看谁艾特我",
      event: "message",
      priority: -114514,
      rule: [
        {
          reg: /^[#/!]?who|谁(艾特|@|at)(我|他|她|它)$/i,
          fnc: "whoAtme",
        },
        {
          reg: /^[#/!]?clear|清除(艾特|at)数据$/i,
          fnc: "clearAt",
        },
        {
          reg: /^[#/!]?clear|清除全部(艾特|at)数据$/i,
          fnc: "clearAll",
          permission: "master",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?who|谁(艾特|@|at)我设置(.*)$/i,
          fnc: "Setting",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?(设置)?查看who|谁(艾特|@|at)我配置$/i,
          fnc: "ViewConfig",
        },
      ],
    });
  }

  async whoAtme(e) {
    const { config } = GetConfig(`config`, `whoAtme`);
    if (!config.switch) {
      return e.reply(`该功能已关闭`);
    }
    if (!e.isGroup) {
      return e.reply("只支持群聊使用");
    }
    let data;
    if (e.atBot) {
      e.at = Bot.uin;
    }
    if (!e.msg.includes("我"))
      data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}_${e.at}`));
    else
      data = JSON.parse(
        await redis.get(`Yz:whoAtme:${e.group_id}_${e.user_id}`),
      );

    if (!data) {
      e.reply("目前还没有人艾特", true);
      return false;
    }
    let msgList = [];

    if (config.reverse) {
      for (let i = data.length - 1; i >= 0; i--) {
        let msg = [];
        msg.push(
          data[i].messageId
            ? {
                type: "reply",
                id: data[i].messageId,
              }
            : "",
        );
        msg.push(data[i].message);

        for (let j = 0; j < data[i].image.length; j++) {
          let localPath = data[i].imageLocal[j];
          let remoteUrl = data[i].image[j];
          if (fs.existsSync(localPath)) {
            //msg.push(`\n图片消息:`);
            msg.push(segment.image(`file://${localPath}`));
          } else {
            try {
              let res = await fetch(remoteUrl, { method: "HEAD" });
              if (res.ok) {
                msg.push(segment.image(remoteUrl));
              } else {
                msg.push("[图片](已过期)");
              }
            } catch (err) {
              msg.push("[图片](已过期)");
            }
          }
        }

        let logo = [
          segment.image(`http://q1.qlogo.cn/g?b=qq&nk=${data[i].User}&s=100`),
        ];
        let Time = formatTime(data[i].time);

        msg.unshift(
          `消息发者: ${data[i].name || data[i].User}\n`,
          ...logo,
          `发送时间: ${Time}\n消息内容:`,
        );

        msgList.push({
          message: msg,
          user_id: data[i].User,
          nickname: data[i].name,
          time: data[i].time,
        });
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        let msg = [];
        msg.push(
          data[i].messageId
            ? {
                type: "reply",
                id: data[i].messageId,
              }
            : "",
        );
        msg.push(data[i].message);

        for (let j = 0; j < data[i].image.length; j++) {
          let localPath = data[i].imageLocal[j];
          let remoteUrl = data[i].image[j];
          if (fs.existsSync(localPath)) {
            //msg.push(`\n图片消息:`);
            msg.push(segment.image(`file://${localPath}`));
          } else {
            try {
              let res = await fetch(remoteUrl, { method: "HEAD" });
              if (res.ok) {
                msg.push(segment.image(remoteUrl));
              } else {
                msg.push("[图片](已过期)");
              }
            } catch (err) {
              msg.push("[图片](已过期)");
            }
          }
        }

        let logo = [
          segment.image(`http://q1.qlogo.cn/g?b=qq&nk=${data[i].User}&s=100`),
        ];
        let Time = formatTime(data[i].time);

        msg.unshift(
          `消息发者: ${data[i].name || data[i].User}\n`,
          ...logo,
          `发送时间: ${Time}\n消息内容:`,
        );

        msgList.push({
          message: msg,
          user_id: data[i].User,
          nickname: data[i].name,
          time: data[i].time,
        });
      }
    }

    let forwardMsg = await e.group.makeForwardMsg(msgList);
    if (typeof forwardMsg.data === "object") {
      let detail = forwardMsg.data?.meta?.detail;
      if (detail) {
        detail.news = [{ text: "点击显示内容" }];
      }
    } else {
      forwardMsg.data = forwardMsg.data
        .replace(/\n/g, "")
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
        .replace(
          /___+/,
          `<title color="#777777" size="26">点击显示内容</title>`,
        );
    }
    await e.reply(`当前为逆序遍历，新消息在上旧消息在下`, true);
    await e.reply(forwardMsg);
    return false;
  }

  async clearAt(e) {
    if (!e.isGroup) {
      e.reply("只支持群聊使用");
      return false;
    }
    let data = await redis.get(`Yz:whoAtme:${e.group_id})_${e.user_id}`);
    if (!data) {
      e.reply("目前数据库没有你的at数据,无法清除", true);
      return false;
    }
    await redis.del(`Yz:whoAtme:${e.group_id}_${e.user_id}`);
    e.reply("已成功清除", true);
  }

  async clearAll(e) {
    let data = await redis.keys("Yz:whoAtme:*");
    for (let i of data) {
      await redis.del(i);
    }
    e.reply("已成功清除全部艾特数据");
  }
  async Setting(e) {
    const { config } = GetConfig(`config`, `whoAtme`);
    const match = e.msg.match(/(开启|关闭|缓存时间|缓存路径)\s*(.*)/);
    if (!match) {
      return e.reply("命令格式错误或未匹配");
    }

    const action = match[1];
    const value = match[2].trim();

    if (action === "开启" || action === "关闭") {
      const type = action === "开启";
      config.switch = type;
      e.reply(`功能已${type ? "开启" : "关闭"}`);
    } else if (action === "图片缓存") {
      if (value === "开启" || value === "关闭") {
        const type = value === "开启";
        config.cacheImage = type;
        e.reply(`图片缓存已${type ? "开启" : "关闭"}`);
      }
    } else if (action === "逆序遍历") {
      config.reverse = value === "开启";
      e.reply(`逆序已${value === "开启" ? "开启" : "关闭"}`);
    } else if (action === "缓存时间") {
      if (!value) {
        return e.reply("请提供有效的缓存时间单位:小时");
      }
      config.cacheTime = value;
      e.reply(`缓存时间已更新为: ${value}`);
    } else if (action === "缓存路径") {
      if (!value) {
        return e.reply("请提供有效的缓存路径");
      }
      config.cachePath = value;
      e.reply(`缓存路径已更新为: ${value}`);
    }
    try {
      saveConfig("whoAtme", config);
    } catch (error) {
      return e.reply("更新配置失败，请稍后再试");
    }
  }
  async ViewConfig(e) {
    const { config } = GetConfig(`config`, `whoAtme`);
    e.reply(
      `谁艾特我配置:\n状态: ${config.switch ? "开启" : "关闭"}\n缓存时间: ${config.cacheTime}小时\n图片缓存: ${config.cacheImage ? "开启" : "关闭"}\n缓存路径: '${config.cachePath}'`,
    );
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  //return `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
  return `${month}月${day}日 ${hours}:${minutes}`;
}
