#pragma once

#include "stdafx.h"

namespace Primum {
	/// 对UUID生成算法的包装
	class UUID
	{
	public:
		UUID();
		virtual ~UUID() = default;

		CString GetString();

	protected:
		GUID uuid;
		CString uuidString;
	};
}
