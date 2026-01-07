// plugins/withAmapConflictFix.js
const { withAppBuildGradle } = require("@expo/config-plugins");

/**
 * 这是一个 Expo Config Plugin，用于解决高德地图 3D SDK 与 定位 SDK 的类重复冲突。
 * 它会在 app/build.gradle 中添加全局排除规则。
 */
module.exports = function withAmapConflictFix(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      // 检查是否已经添加过，避免重复注入
      if (!contents.includes("exclude group: 'com.amap.api', module: 'location'")) {
        // 在 android {} 块之后的 configurations 中添加排除规则
        // 这样可以确保整个项目（包括所有第三方库）都不会重复引入独立的 location 包
        const fixCode = `
allprojects {
    configurations.all {
        exclude group: 'com.amap.api', module: 'location'
    }
}
`;
        contents += fixCode;
        config.modResults.contents = contents;
      }
    }
    return config;
  });
};
