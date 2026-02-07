import { userStore } from '@/store/user';

// 扩展 App 实例类型，便于在全局访问 store
interface IAppOption {
  globalStore: {
    userStore: typeof userStore;
  };
}

App<IAppOption>({
  globalStore: {
    userStore,
  },

  onLaunch() {
    // 小程序启动时可以做初始化逻辑（如埋点、主题初始化等）
    // 这里留空，作为企业项目模板扩展点
  },
});

