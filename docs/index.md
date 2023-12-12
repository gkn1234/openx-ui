---
# VitePress 支持在 markdown 中通过 Frontmatter 写 yaml 配置，设置页面的主题样式
# https://vitepress.dev/reference/frontmatter-config#frontmatter-config

# VitePress 默认主题的首页模板：https://vitepress.dev/reference/default-theme-layout#home-layout
layout: home

title: OpenxUI

hero:
  name: OpenxUI
  text: Vue3 组件库
  tagline: 从 0 到 1 搭建 Vue 组件库
  image:
    src: /logo.png
    alt: OpenX
  actions:
    - theme: brand
      text: 指南
      link: /guide/
    - theme: brand
      text: 组件
      link: /components/
    - theme: brand
      text: API 文档
      link: /api/
    - theme: brand
      text: 演练场
      link: /playground
    - theme: alt
      text: Github
      link: https://open.codehub.huawei.com/innersource/OpenxUI/openx-ui/files?ref=master
---
