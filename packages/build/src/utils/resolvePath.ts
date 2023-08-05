import { relative, resolve, sep } from 'node:path';

/** 给予一个基础路径，获取到一个以此为基准计算绝对路径的方法 */
export function usePathAbs(basePath: string) {
  return (...paths: string[]) => normalizePath(resolve(basePath, ...paths));
}

/** 获取相对于当前脚本执行位置的绝对路径 */
export const absCwd = usePathAbs(process.cwd());

/** 给予一个基础路径，获取到一个以此为基准计算相对路径的方法 */
export function usePathRel(basePath: string) {
  return (path: string, ignoreLocalSignal: boolean = true) => {
    const result = normalizePath(relative(basePath, path));
    if (result.slice(0, 2) === '..') {
      return result;
    }
    return ignoreLocalSignal ? result : `./${result}`;
  };
}

/** 获取相对于当前脚本执行位置的相对路径 */
export const relCwd = usePathRel(process.cwd());

/** 抹平 Win 与 Linux 系统路径分隔符之间的差异 */
function normalizePath(path: string) {
  if (sep === '/') {
    return path;
  }
  return path.replace(new RegExp(`\\${sep}`, 'g'), '/');
}
