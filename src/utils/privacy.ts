/**
 * 隐私授权检查工具：
 * 在调用可能涉及隐私的核心能力前，先调用该函数。
 */
export function checkPrivacy(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 基础库低版本兜底：无 requirePrivacyAuthorize 时默认放行
    if (typeof wx.requirePrivacyAuthorize !== 'function') {
      resolve();
      return;
    }

    wx.requirePrivacyAuthorize({
      success: () => {
        resolve();
      },
      fail: (error) => {
        wx.showToast({
          title: '请先同意隐私协议',
          icon: 'none',
          duration: 2000,
        });
        reject(error);
      },
    });
  });
}

