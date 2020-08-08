# DayPrimer Core

![Dependency](https://img.shields.io/david/lightyears1998/day-primer-core)
[![Build Status](https://travis-ci.com/lightyears1998/day-primer-core.svg?branch=master)](https://travis-ci.com/lightyears1998/day-primer-core)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3a1173d51889491cab9cb1ab895db551)](https://www.codacy.com/manual/lightyears1998/day-primer-core?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lightyears1998/day-primer-core&amp;utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/lightyears1998/day-primer-core/badge.svg?branch=master)](https://coveralls.io/github/lightyears1998/day-primer-core?branch=master)

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@lightyears1998/day-primer-core)
![npm download per month](https://img.shields.io/npm/dm/@lightyears1998/day-primer-core)
![Github Star](https://img.shields.io/github/stars/lightyears1998/day-primer-core)

## 警告：现阶段的代码丑！而！且！乱

---

> 不要嘗試隱藏系統的複雜性，否則就會得到一個更複雜的系統。

暂时不分离CORE与CLI。分离时应该借助mocha对CORE进行单元测试以保证正确性。

## TODO

1. 增加开始或关闭的Hitokoto的选项。

## 重构

- [ ] 视图管理器大魔改：仿照 Android 的 Activity 栈方式管理视图以及视图之间的跳转。

---

## 同步算法

同步建立在“從不刪除項目”的基礎上。

1. 全量同步
2. 定位增量同步 根據`updateDate`二分搜索定位上服務器客戶端中`updateDate`不同的第一個項目。
3. 分支增量同步 類似於git中的分支合并算法。
