# phase-core

[![Build Status](https://travis-ci.com/lightyears1998/phase-core.svg?branch=master)](https://travis-ci.com/lightyears1998/phase-core)

> 不要嘗試隱藏系統的複雜性，否則就會得到一個更複雜的系統。

## 同步算法

同步建立在“從不刪除項目”的基礎上。

1. 全量同步
2. 定位增量同步 根據`updateDate`二分搜索定位上服務器客戶端中`updateDate`不同的第一個項目。
3. 分支增量同步 類似於git中的分支合并算法。
