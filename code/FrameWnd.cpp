#include "stdafx.h"
#include "FrameWnd.h"
#include "DialogNewTask.h"

using namespace Primum;

FrameWnd::FrameWnd()
{
	Create(nullptr, TEXT("Primum"), WS_OVERLAPPEDWINDOW, CRect(0, 0, 800, 600), 
		nullptr, MAKEINTRESOURCE(IDR_MENU_TASK)
	);

	// 添加资源图标
	SetIcon(LoadIcon(theApp.m_hInstance, MAKEINTRESOURCE(IDI_APP_ICON)), TRUE);
	SetIcon(LoadIcon(theApp.m_hInstance, MAKEINTRESOURCE(IDI_APP_ICON)), FALSE);
}

BEGIN_MESSAGE_MAP(Primum::FrameWnd, CFrameWnd)
	ON_WM_CONTEXTMENU()
	ON_COMMAND(ID_NEW_TASK, &FrameWnd::OnNewTask)
END_MESSAGE_MAP()


void FrameWnd::OnContextMenu(CWnd* /*pWnd*/, CPoint point)
{
	CMenu menu;
	menu.LoadMenu(IDR_MENU_TASK);
	menu.GetSubMenu(0)->TrackPopupMenu(TPM_RIGHTALIGN | TPM_RIGHTBUTTON, point.x, point.y, this);
}


void FrameWnd::OnNewTask()
{
	DialogNewTask dialog;
	dialog.DoModal();
}
