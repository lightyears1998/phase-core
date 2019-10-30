#include "stdafx.h"
#include "DialogNewTask.h"
#include "afxdialogex.h"

#include "DialogNewTask.h"
#include "Task.h"

using namespace Primum;

IMPLEMENT_DYNAMIC(DialogNewTask, CDialogEx)


DialogNewTask::DialogNewTask(CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_DIALOG_NEW_TASK, pParent)
{

}

DialogNewTask::~DialogNewTask()
{

}

void DialogNewTask::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT_DETAIL, detail);
	DDX_Text(pDX, IDC_EDIT_SUMMARY, summary);
}

BEGIN_MESSAGE_MAP(DialogNewTask, CDialogEx)
	ON_BN_CLICKED(IDC_BUTTON_CONFIRM, &DialogNewTask::OnBnClickedButtonConfirm)
	ON_BN_CLICKED(IDC_CANCEL, &DialogNewTask::OnBnClickedCancel)
	ON_BN_CLICKED(IDC_BUTTON_CONFIRM_AND_CONTINUE, &DialogNewTask::OnBnClickedButtonConfirmAndContinue)
END_MESSAGE_MAP()


void Primum::DialogNewTask::OnBnClickedButtonConfirm()
{
	UpdateData(TRUE);
	Task task(summary, detail);
	theApp.tasks->Add(task);
}


void Primum::DialogNewTask::OnBnClickedCancel()
{
	CDialogEx::OnCancel();
}


void Primum::DialogNewTask::OnBnClickedButtonConfirmAndContinue()
{
	// TODO: Add your control notification handler code here
}
