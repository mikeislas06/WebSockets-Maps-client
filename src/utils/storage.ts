import Cookies from 'js-cookie';

const memoryStorage = new Map<string, string>();

export const getStorageItem = (key: string): string | undefined => {
    const isIframe = window !== window.parent;

    // Use Cookies for independent usage
    if (!isIframe) {
        const cookieVal = Cookies.get(key);
        if (cookieVal !== undefined) return cookieVal;
    }

    // Fallback to localStorage (used in iframes if permitted)
    try {
        const item = localStorage.getItem(key);
        if (item !== null) return item;
    } catch (e) {
        // Ignored, likely blocked by browser security
    }

    // Ultimate fallback to memory
    return memoryStorage.get(key);
};

export const setStorageItem = (key: string, value: string): void => {
    const isIframe = window !== window.parent;

    if (!isIframe) {
        Cookies.set(key, value);
    }

    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // Ignored
    }

    memoryStorage.set(key, value);
};

export const removeStorageItem = (key: string): void => {
    const isIframe = window !== window.parent;

    if (!isIframe) {
        Cookies.remove(key);
    }

    try {
        localStorage.removeItem(key);
    } catch (e) {
        // Ignored
    }

    memoryStorage.delete(key);
};
