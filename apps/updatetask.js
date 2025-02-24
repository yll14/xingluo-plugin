import fetch from "node-fetch";
import cfg from "../../../lib/config/config.js";
import moment from "moment";
import {
  GetConfig,
  PluginName_en,
  PluginName_zh,
  saveConfig,
} from "../function/function.js";
const { config } = GetConfig(`config`, `updatetask`);
const prefix = "bubble:codeUpdateTask:";
let REPOSITORY_LIST = [];
const repositories = config.customRepository.split(",");
const CUSTOM_REPOSITORY = repositories;
init();

export class xingluoUpdateTask extends plugin {
  constructor() {
    super({
      name: `${PluginName_zh}检查更新`,
      event: "message",
      priority: 1000,
      rule: [
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?检查更新$/i,
          fnc: "UpdateTask",
        },
        {
          reg: /^[#/!]?(xl|星落|xingluo)(插件)?更新推送设置(.*)$/i,
          fnc: "Setting",
        },
      ],
    });
    this.task = {
      cron: config.cron,
      name: `${PluginName_en}定时检查更新`,
      log: false,
      fnc: () => this.UpdateTask(),
    };
  }

  async UpdateTask(e) {
    const { config } = GetConfig(`config`, `updatetask`);
    if (!config.switch) {
      // logger.error('UpdateTask已关闭');
      return true;
    }

    // 去重
    REPOSITORY_LIST = Array.from(new Set(REPOSITORY_LIST));
    if (REPOSITORY_LIST.length === 0) {
      logger.info("未检测到有效的仓库地址");
      return false;
    }

    let content = [];
    let index = -1;

    for (const item of REPOSITORY_LIST) {
      index++;
      if (index > 1) {
        await this.sleep(1000);
      }

      let repositoryData = await this.getGiteeLatestCommit(
        item.owner,
        item.repo,
      );
      if (!repositoryData?.sha) {
        continue; // 跳过无提交记录的仓库
      }

      const redisKey = `${prefix}${item.owner}/${item.repo}`;
      let redisSha = await redis.get(redisKey);

      if (redisSha && String(redisSha) === String(repositoryData.sha)) {
        continue; // 跳过无更新的仓库
      }

      await redis.set(redisKey, repositoryData.sha);
      content.push(repositoryData);
    }

    if (content.length > 0) {
      const msg =
        `检测到项目更新...\n` +
        content
          .map(
            (i) =>
              `项目名称：${i.owner}/${i.repo}\n开发者名称：${i.author}\n开发者邮箱：${i.email}\n更新信息：${i.message}\n更新时间：${i.date}\n`,
          )
          .join("\n");

      const masters = cfg.masterQQ;
      for (const master of masters) {
        if (master.toString().length > 11) continue;
        await Bot.pickFriend(master).sendMsg(msg);
        await this.sleep(2000);
      }
    }
  }

  async getGiteeLatestCommit(owner, repo) {
    const apiUrl = `https://gitee.com/api/v5/repos/${owner}/${repo}/commits`;

    try {
      const response = await fetch(apiUrl);
      const commits = await response.json();

      if (commits.length > 0) {
        const latestCommit = commits[0];
        return {
          owner,
          repo,
          sha: latestCommit.sha,
          author: latestCommit.commit.author.name,
          email: latestCommit.commit.author.email,
          date: moment(latestCommit.commit.author.date).format(
            "YYYY-MM-DD HH:mm:ss",
          ),
          message: latestCommit.commit.message.trim(),
        };
      } else {
        return { error: "该仓库没有提交记录。" };
      }
    } catch (error) {
      return { error: "查询出错：" + error.message };
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async Setting(e) {
    const { config } = GetConfig(`config`, `updatetask`);
    const match = e.msg.match(/(开启|关闭|cron|仓库地址)\s*(.*)/);
    if (!match) {
      return e.reply("命令格式错误或未匹配");
    }

    const action = match[1];
    const value = match[2].trim();

    if (action === "开启" || action === "关闭") {
      const type = action === "开启";
      config.switch = type;
      e.reply(`更新推送已${type ? "开启" : "关闭"}`);
    } else if (action === "cron") {
      if (!value) {
        return e.reply("请提供有效的 cron 表达式");
      }
      config.cron = value;
      e.reply(`cron 表达式已更新为: ${value}`);
    } else if (action === "仓库地址") {
      if (!value) {
        return e.reply("请提供有效的仓库地址");
      }
      config.customRepository = value;
      e.reply(`自定义仓库地址已更新为: ${value}`);
    }

    saveConfig("updatetask", config);
  }
}

function init() {
  function gitRemoteUrl(remoteUrl) {
    const urlMatch = remoteUrl.match(
      /^(?:https?:\/\/)?(?:[^/]+\/)+([^/]+)\/([^/]+)(?:\.git)?$/,
    );
    const sshUrlMatch = remoteUrl.match(/^.+@(.+):([^/]+)\/([^/]+)\.git$/);

    if (urlMatch) {
      const owner = urlMatch[1];
      const repo = urlMatch[2].replace(".git", "");
      REPOSITORY_LIST.push({
        source: "Gitee",
        owner,
        repo,
      });
    } else if (sshUrlMatch) {
      const owner = sshUrlMatch[2];
      const repo = sshUrlMatch[3];
      REPOSITORY_LIST.push({
        source: "Gitee",
        owner,
        repo,
      });
    }
  }

  if (CUSTOM_REPOSITORY.length > 0) {
    CUSTOM_REPOSITORY.forEach((item) => {
      gitRemoteUrl(item);
    });
  }

  logger.info("初始化完成，已处理 CUSTOM_REPOSITORY 列表");
}
