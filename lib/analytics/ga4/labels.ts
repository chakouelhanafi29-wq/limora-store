const CHANNEL_LABELS: Record<string, string> = {
  "Organic Search": "بحث عضوي",
  "Paid Search": "بحث مدفوع",
  "Organic Social": "سوشيال عضوي",
  "Paid Social": "سوشيال مدفوع",
  Direct: "مباشر",
  Referral: "إحالة",
  Email: "بريد",
  "Paid Other": "مدفوع آخر",
  Display: "عرض",
  "Organic Video": "فيديو عضوي",
  "Paid Video": "فيديو مدفوع",
  Unassigned: "غير مصنّف",
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: "جوال",
  desktop: "كمبيوتر",
  tablet: "تابلت",
};

const COUNTRY_LABELS: Record<string, string> = {
  SA: "السعودية",
  AE: "الإمارات",
  KW: "الكويت",
  QA: "قطر",
  BH: "البحرين",
  OM: "عُمان",
  EG: "مصر",
  US: "الولايات المتحدة",
};

export function labelChannel(value: string): string {
  return CHANNEL_LABELS[value] ?? value;
}

export function labelDevice(value: string): string {
  const key = value.toLowerCase();
  return DEVICE_LABELS[key] ?? value;
}

export function labelCountry(value: string): string {
  return COUNTRY_LABELS[value] ?? value;
}
