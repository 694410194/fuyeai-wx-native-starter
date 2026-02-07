import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { userStore, type IUserInfo } from '@/store/user';
import { request } from '@/utils/request';
import { checkPrivacy } from '@/utils/privacy';

interface IIndexData {
  userInfo: IUserInfo | null;
  isLogin: boolean;
}

interface IIndexCustom {
  storeBindings?: {
    updateStoreBindings: () => void;
    destroyStoreBindings: () => void;
  };
  handleMockLogin: () => Promise<void>;
  handleLogout: () => void;
  handleRequestDemo: () => Promise<void>;
}

type DemoPingResponse = {
  message: string;
  timestamp: number;
};

Page<IIndexData, IIndexCustom>({
  data: {
    userInfo: null,
    isLogin: false,
  },

  onLoad() {
    // Page 中推荐使用手工绑定：可控且便于释放
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: {
        userInfo: 'userInfo',
        isLogin: 'isLogin',
      },
      actions: {
        logout: 'logout',
      },
    });
  },

  onUnload() {
    // 必须销毁绑定，避免页面销毁后响应仍然存在（内存泄漏）
    this.storeBindings?.destroyStoreBindings();
  },

  async handleMockLogin() {
    try {
      // 登录前可先检查隐私协议
      await checkPrivacy();

      // Demo 场景中直接传入模拟 code
      await userStore.login('demo_code_from_index_page');

      wx.showToast({
        title: '模拟登录成功',
        icon: 'success',
      });
    } catch (_error) {
      // checkPrivacy 已有提示，这里无需重复 toast
    }
  },

  handleLogout() {
    userStore.logout();
    wx.showToast({
      title: '已退出登录',
      icon: 'none',
    });
  },

  async handleRequestDemo() {
    try {
      await checkPrivacy();

      // 演示调用封装 request（会自动拼接 baseURL + 注入 token + 统一错误处理）
      const res = await request<DemoPingResponse>({
        url: '/ping',
        method: 'GET',
      });

      wx.showModal({
        title: '请求成功',
        content: `message: ${res.message}\n时间戳: ${res.timestamp}`,
        showCancel: false,
      });
    } catch (_error) {
      // 错误由 request 统一 toast，这里仅做静默兜底
    }
  },
});
