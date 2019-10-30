#include "stdafx.h"
#include "Task.h"

using namespace Primum;

Task::Task(const CString& summary, const CString& detail)
{
	this->modifiedTime = CTime::GetCurrentTime();
	this->createdTime = CTime::GetCurrentTime();

	this->summary = summary;
	this->detail = detail;
}

Task::~Task()
{

}

CString Task::GetString() const
{
	CString str;
	str.Format(TEXT("%s: %s"), summary, detail);
	return str;
}
