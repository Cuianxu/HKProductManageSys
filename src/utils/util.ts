import type { Menus } from '@/interface'

//逐级寻找菜单的title
export const findMenuNameByPath = (menus: Menus[], path: string): string[] => {
  let name = []
  for (const item of menus) {
    if (item.children && item.children.length != 0) {
      name.push(...findMenuNameByPath(item.children, path))
      if (name.length == 0) {
        continue
      } else {
        name.push(item.authName)
        return name
      }

    } else if (item.path == path) {
      name.push(item.authName)
      return name
    }
  }
  return name
}