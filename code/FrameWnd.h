#pragma once

#include "stdafx.h"

namespace Primum {

	class FrameWnd :
		public CFrameWnd
	{
	public:
		FrameWnd();
		virtual ~FrameWnd() = default;

		DECLARE_MESSAGE_MAP()
		afx_msg void OnContextMenu(CWnd* /*pWnd*/, CPoint point);
		afx_msg void OnNewTask();
	};

}
