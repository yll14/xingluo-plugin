import { PluginName_zh } from "../function/function.js";
import { update as Update } from "../../other/update.js";
export class luoluoupdate extends plugin {
  constructor() {
    super({
      name: "洛洛插件更新",
      event: "message",
      priority: 1000,
      rule: [
        {
          reg: /^#?(ll|洛洛|luoluo)(插件)?(强制)?更新$/i,
          fnc: "update",
        },
        {
          reg: /^#?(ll|洛洛|luoluo)(插件)?更新日志$/i,
          fnc: "updateLog",
        },
      ],
    });
  }

  async update(e = this.e) {
    const Type = e.msg.includes("强制") ? "#强制更新" : "#更新";
    e.msg = Type + PluginName_zh;
    const up = new Update(e);
    up.e = e;
    return up.update();
  }

  async updateLog(e = this.e) {
    e.msg = "#更新日志" + PluginName_zh;
    const up = new Update(e);
    up.e = e;
    return up.updateLog();
  }
}
