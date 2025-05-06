export function isActive(currentPath: string, url: string) {
    return currentPath === url ? true : false;
  }