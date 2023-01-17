type TResult = {
  ret: boolean;
  lat: number;
  lon: number;
  cityId: number;
}

abstract class ILocationHandler {
  abstract canIUse(): boolean;
  abstract doHandle(): Promise<Partial<TResult>>;

  protected nextHandler: ILocationHandler | null;

  constructor() {
    this.nextHandler = null;
  }

  setNextHandle(handler: ILocationHandler) {
    this.nextHandler = handler;
  }

  async nextHandlerHandle(): Promise<Partial<TResult>> {
    if (this.nextHandler) {
      return await this.nextHandler.handle();
    }
    return Promise.resolve({ ret: false });
  }

  async handle(): Promise<Partial<TResult>> {
    if (this.canIUse()) {
      const result = await this.doHandle();
      if (!result.ret) {
        return await this.nextHandlerHandle();
      }
      return result;
    } else {
      return await this.nextHandlerHandle();
    }
  }
}

const mockUrlParamsResolver = () =>
  Promise.resolve({
    ret: false
  });

const mockAppActionResolver = () =>
  Promise.resolve({
    ret: true,
    lat: 111,
    lon: 111
  });

const mockBaiduSDKResolver = () =>
  Promise.resolve({
    ret: true,
    lat: 999,
    lon: 999
  });

class UrlParamsLocationHandler extends ILocationHandler {
  canIUse(): boolean {
    return true;
  }

  doHandle(): Promise<Partial<TResult>> {
    return mockUrlParamsResolver();
  }
}

class AppActionLocationHandler extends ILocationHandler {
  canIUse(): boolean {
    return false;
  }

  doHandle(): Promise<Partial<TResult>> {
    return mockAppActionResolver();
  }
}

class BaiduSDKLocationHandler extends ILocationHandler {
  canIUse(): boolean {
    return true;
  }

  doHandle(): Promise<Partial<TResult>> {
    return mockBaiduSDKResolver();
  }
}

// 其实就是一个链表
class LocationChain {
  private static instance: LocationChain;

  /** 指针 */
  private head: ILocationHandler | null;
  private tail: ILocationHandler | null;

  private constructor() {
    this.head = null;
    this.tail = null;
  }

  static getInstance() {
    if (LocationChain.instance) {
      return LocationChain.instance;
    } else {
      return LocationChain.instance = new LocationChain();
    }
  }

  append(handler: ILocationHandler) {
    if (!this.head) {
      this.head = handler;
      this.tail = handler;
      return;
    }

    this.tail?.setNextHandle(handler);
    this.tail = handler;
  }

  async execute() {
    if (!this.head) {
      throw new Error("you should add some handler.");
    } else {
      return await this.head.handle();
    }
  }
}

const urlParamsHandler = new UrlParamsLocationHandler();
const appActionHandler = new AppActionLocationHandler();
const baiduSDKLocationHandler = new BaiduSDKLocationHandler();

const chain = LocationChain.getInstance();
chain.append(urlParamsHandler);
chain.append(appActionHandler);
chain.append(baiduSDKLocationHandler);

(async () => {
  const result = await chain.execute();
  console.log("result:", result);
})();

export {}
