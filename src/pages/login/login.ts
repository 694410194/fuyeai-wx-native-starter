import { userStore } from '@/store/user';

Page({
  async handleLogin() {
    try {
      // 真实项目中请通过 wx.login 获取 code 后再传给 userStore.login
      await userStore.login('demo_code_from_login_page');

      wx.showToast({
        title: '登录成功',
        icon: 'success',
      });

      // 登录后返回上一页
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
        return;
      }

      wx.reLaunch({
        url: '/pages/index/index',
      });
    } catch (_error) {
      // 失败提示已在 store 内处理
    }
  },
});

