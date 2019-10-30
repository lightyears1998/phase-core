#pragma once

#include "stdafx.h"

namespace Primum {
	/// 任务
	/// <summary>
	/// 1. 全局唯一标识符
	/// 2. 日期和时间属性 创建时间 修改时间
	/// 3. 提要（标题）
	/// 4. 详情（正文）
	/// TODO:
	/// 5. 番茄消耗 预计番茄消耗、实际番茄消耗
	/// 6. 先决关系（任务依赖、图像化）
	/// </summary>
	class Task
	{
	public:
		Task() = default;
		Task(const CString &summary, const CString& detail = "");

		virtual ~Task();

		// 获取任务的字符串表示
		CString GetString() const;

	protected:
		UUID uuid;  // 全局唯一标识符
		CTime modifiedTime;  // 任务修改时间
		CTime createdTime;  // 任务创建时间

		CString summary;  // 任务提要（标题）
		CString detail;  // 任务详情（正文）
	};
}
