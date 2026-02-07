import { action, makeAutoObservable } from 'mobx-miniprogram';
import { checkPrivacy } from '@/utils/privacy';

const TOKEN_STORAGE_KEY = 'fuyeai_token';
const USER_INFO_STORAGE_KEY = 'fuyeai_user_info';

export interface IUserInfo {
  id: string;
  nickname: string;
  avatar: string;
}

class UserStore {
  token = '';

  userInfo: IUserInfo | null = null;

  constructor() {
    makeAutoObservable(this, {
      login: action.bound,
      logout: action.bound,
      setToken: action.bound,
      setUserInfo: action.bound,
    });

    // 启动时恢复本地持久化状态
    this.token = wx.getStorageSync(TOKEN_STORAGE_KEY) || '';
    this.userInfo = wx.getStorageSync(USER_INFO_STORAGE_KEY) || null;
  }

  get isLogin(): boolean {
    return Boolean(this.token);
  }

  setToken(token: string): void {
    this.token = token;

    if (token) {
      wx.setStorageSync(TOKEN_STORAGE_KEY, token);
      return;
    }

    wx.removeStorageSync(TOKEN_STORAGE_KEY);
  }

  setUserInfo(userInfo: IUserInfo | null): void {
    this.userInfo = userInfo;

    if (userInfo) {
      wx.setStorageSync(USER_INFO_STORAGE_KEY, userInfo);
      return;
    }

    wx.removeStorageSync(USER_INFO_STORAGE_KEY);
  }

  /**
   * 登录动作：
   * 这里用 mock 逻辑演示企业项目中常见的登录流程入口。
   * 实际项目可在此调用后端 /auth/login 接口换取 token。
   */
  async login(code: string): Promise<void> {
    if (!code) {
      wx.showToast({
        title: '登录 code 不能为空',
        icon: 'none',
      });
      return;
    }

    // 登录前先进行隐私授权检查
    await checkPrivacy();

    // Demo：使用 code 生成模拟 token
    const token = `token_${code}_${Date.now()}`;

    this.setToken(token);
    this.setUserInfo({
      id: 'u_demo_001',
      nickname: '副业AI用户',
      avatar:
        'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
    });
  }

  logout(): void {
    this.setToken('');
    this.setUserInfo(null);
  }
}

export const userStore = new UserStore();

