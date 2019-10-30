#include "stdafx.h"
#include "UUID.h"

using namespace Primum;

Primum::UUID::UUID()
{
	CoCreateGuid(&uuid);
	uuidString.Format(TEXT("%08X-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X"),
		uuid.Data1, uuid.Data2, uuid.Data3,
		uuid.Data4[0], uuid.Data4[1], uuid.Data4[2], uuid.Data4[3],
		uuid.Data4[4], uuid.Data4[5], uuid.Data4[6], uuid.Data4[7]
	);
}

CString Primum::UUID::GetString()
{
	return uuidString;
}
