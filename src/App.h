#pragma once

#include "stdafx.h"
#include "Task.h"

namespace Primum {
	class App :
		public CWinApp
	{
	public:
		App() = default;
		~App() = default;

		// 任务列表
		CArray<Primum::Task> * tasks = nullptr;

		BOOL InitInstance();
		virtual int ExitInstance();
	};
}
