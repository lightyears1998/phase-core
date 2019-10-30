#include "stdafx.h"
#include "Logcat.h"

using namespace Primum;

Logcat::Logcat(CONST CString& path, BOOL truncate)
{
	filepath = path;
	file.Open(filepath, CFile::modeCreate | (truncate ? 0U : CFile::modeNoTruncate) | CFile::modeWrite);
	if (file.m_hFile != CFile::hFileNull) {
		file.SeekToEnd();
	}
}


Logcat::~Logcat()
{
	if (file.m_hFile != CFile::hFileNull) {
		file.Close();
	}
}


CString Logcat::GetLogFilePath()
{
	return filepath;
}


BOOL Logcat::SetLogFilePath(CONST CString& path)
{
	filepath = path;
	file.Open(filepath, CFile::modeCreate | CFile::modeNoTruncate | CFile::modeWrite);
	return (file.m_hFile != CFile::hFileNull);
}


VOID Logcat::Log(CONST CString& level, CONST CString& tag, CONST CString& voice)
{
	if (file.m_hFile != CFile::hFileNull) {
		// 准备时间戳
		CString stamp;
		CTime time = CTime::GetCurrentTime();
		stamp.Format(TEXT("%d-%d %02d:%02d:%02d %s/%s"),
			time.GetMonth(), time.GetDay(), time.GetHour(), time.GetMinute(), time.GetSecond(),
			level, tag);

		// 拼合时间戳和日志
		CString sentence;
		sentence.Format(TEXT("%s: %s\n"), stamp, voice);

		// 转换为UTF8后输出
		int len = WideCharToMultiByte(CP_UTF8, 0, sentence.GetBuffer(), CString::StringLength(sentence), nullptr, 0, NULL, NULL);
		char * utf8 = new char[len];
		WideCharToMultiByte(CP_UTF8, 0, sentence.GetBuffer(), CString::StringLength(sentence), utf8, len, NULL, NULL);
		file.Write(utf8, len);

		delete utf8; utf8 = nullptr;
	}
}


VOID Logcat::Verbose(CONST CString& tag, const CString & voice)
{
	Log("V", tag, voice);
}


VOID Logcat::V(CONST CString& tag, const CString & voice)
{
	Verbose(tag, voice);
}


VOID Logcat::Debug(CONST CString& tag, const CString & voice)
{
	Log("D", tag, voice);
}


VOID Logcat::D(CONST CString& tag, const CString & voice)
{
	Debug(tag, voice);
}


VOID Logcat::Info(CONST CString& tag, const CString & voice)
{
	Log("I", tag, voice);
}


VOID Logcat::I(CONST CString& tag, const CString & voice)
{
	Info(tag, voice);
}


VOID Logcat::Warn(CONST CString& tag, const CString & voice)
{
	Log("W", tag, voice);
}


VOID Logcat::W(CONST CString& tag, CONST CString & voice)
{
	Warn(tag, voice);
}


VOID Logcat::Error(CONST CString& tag, CONST CString& voice)
{
	Log("E", tag, voice);
}


VOID Logcat::E(CONST CString& tag, CONST CString & voice)
{
	Error(tag, voice);
}

VOID Logcat::Assert(const CString & tag, const CString & voice)
{
	Log("A", tag, voice);
}

VOID Logcat::A(const CString & tag, const CString & voice)
{
	Assert(tag, voice);
}
