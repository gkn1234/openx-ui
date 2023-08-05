import {
  readFile,
  writeFile,
} from 'node:fs/promises';

/**
 * 从文件中读取出 JSON 对象
 * @param filePath 文件路径
 * @returns JSON 对象
 */
export async function readJsonFile<
  T extends Record<string, any> = Record<string, any>,
>(filePath: string): Promise<T> {
  const buffer = await readFile(filePath, 'utf-8');
  return JSON.parse(buffer);
}

/**
 * 将 JSON 对象写入文件
 * @param filePath 文件路径
 * @param rests {@link JSON.stringify} 的参数
 */
export async function writeJsonFile(filePath: string, ...rests: Parameters<typeof JSON.stringify>) {
  await writeFile(filePath, JSON.stringify(...rests), 'utf-8');
}
