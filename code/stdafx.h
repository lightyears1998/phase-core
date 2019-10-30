#pragma once

// 预定义常量
#define _WIN32_WINNT _WIN32_WINNT_MAXVER

// MFC相关头文件
#include <afxwin.h>
#include <afxcontrolbars.h>

// MFC生成的符号
#include "resource.h"

// Primum CWinApp实例
#include "App.h"
extern Primum::App theApp;

// Primum日志工具
#include "Logcat.h"
#include <afxcontrolbars.h>
extern Primum::Logcat Log;  // 全局唯一Logcat对象
