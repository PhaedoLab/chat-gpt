const getStorage = (key: string, type: string) => {
    if (typeof window === "undefined") {
      return null;
    }
    let item = window[`${type}Storage` as keyof Window].getItem(key);
    try {
      item = JSON.parse(item);
    } finally {
      /* tslint:disable no-unsafe-finally */
      return item;
    }
  };
  const setStorage = (key: string, value: any, type: string) => {
    return window[`${type}Storage` as keyof Window].setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
      type
    );
  };
  const removeStorage = (key: string, type: string) =>
    window[`${type}Storage` as keyof Window].removeItem(key);
  const clearStorage = (type: string) =>
    window[`${type}Storage` as keyof Window].clear();
  
  const generate = (type: string) => ({
    type,
    get: (key: string) => getStorage(key, type),
    set: (key: string, value: any) => {
      setStorage(key, value, type);
      return type === "session" ? sessionStorage : localStorage;
    },
    remove: (key: string) => {
      removeStorage(key, type);
      return type === "session" ? sessionStorage : localStorage;
    },
    clear: () => clearStorage(type),
  });
  
  export const sessionStorage = (() => generate("session"))();
  export const localStorage = (() => generate("local"))();
  

  export const formatTimer = function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}

  export default {
    sessionStorage,
    localStorage,
  };