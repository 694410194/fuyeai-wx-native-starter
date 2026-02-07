/**
 * 小程序环境枚举：用于多环境 API 基地址切换
 */
export type MiniProgramEnvVersion = 'develop' | 'trial' | 'release';

/**
 * 获取当前小程序运行环境。
 * - develop: 开发版
 * - trial: 体验版
 * - release: 正式版
 */
export function getMiniProgramEnvVersion(): MiniProgramEnvVersion {
  try {
    const envVersion = wx.getAccountInfoSync().miniProgram.envVersion;
    return envVersion;
  } catch (_error) {
    // 兜底策略：在异常场景下默认按 develop 处理，避免阻塞开发
    return 'develop';
  }
}

