export const classes = ["৬ষ্ঠ", "৭ম", "৮ম", "৯ম", "১০ম"];

export const examTypes = [
  "প্রথম সাময়িক পরীক্ষা",
  "অর্ধবার্ষিক পরীক্ষা",
  "বার্ষিক পরীক্ষা",
  "মডেল টেস্ট",
];

const subjectSets = {
  "৬ষ্ঠ": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "সমাজবিজ্ঞান"],
  "৭ম": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "সমাজবিজ্ঞান"],
  "৮ম": ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "তথ্য ও যোগাযোগ প্রযুক্তি"],
  "৯ম": ["বাংলা", "ইংরেজি", "গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "তথ্য ও যোগাযোগ প্রযুক্তি"],
  "১০ম": ["বাংলা", "ইংরেজি", "গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "হিসাববিজ্ঞান"],
};

// শিক্ষার্থীর নাম — শ্রেণি ও রোল অনুযায়ী ডেমো তালিকা
export const students = {
  "৬ষ্ঠ": [
    { roll: 1, name: "আরিশা তাসনিম" },
    { roll: 2, name: "সাদমান সাকিব" },
    { roll: 3, name: "নুসরাত জাহান" },
  ],
  "৭ম": [
    { roll: 1, name: "তানভীর আহমেদ" },
    { roll: 2, name: "মেহজাবিন আক্তার" },
    { roll: 3, name: "রায়হান কবির" },
  ],
  "৮ম": [
    { roll: 1, name: "সুমাইয়া ইসলাম" },
    { roll: 2, name: "আবরার ফাহিম" },
    { roll: 3, name: "জান্নাতুল ফেরদৌস" },
  ],
  "৯ম": [
    { roll: 1, name: "মাহির শাহরিয়ার" },
    { roll: 2, name: "ফাহমিদা হক" },
    { roll: 3, name: "ইশতিয়াক রহমান" },
  ],
  "১০ম": [
    { roll: 1, name: "আফসানা মিমি" },
    { roll: 2, name: "নাহিয়ান চৌধুরী" },
    { roll: 3, name: "তাসফিয়া নূর" },
  ],
};

const examOffset = {
  "প্রথম সাময়িক পরীক্ষা": -3,
  "অর্ধবার্ষিক পরীক্ষা": 0,
  "বার্ষিক পরীক্ষা": 3,
  "মডেল টেস্ট": -5,
};

function gradeOf(mark) {
  if (mark >= 80) return { grade: "A+", point: 5 };
  if (mark >= 70) return { grade: "A", point: 4 };
  if (mark >= 60) return { grade: "A-", point: 3.5 };
  if (mark >= 50) return { grade: "B", point: 3 };
  if (mark >= 40) return { grade: "C", point: 2 };
  return { grade: "F", point: 0 };
}

// ডেমো ফলাফল — সম্পূর্ণ ফ্রন্টএন্ড স্ট্যাটিক হিসাব
export function getResult(className, roll, exam) {
  const list = students[className] || [];
  const student = list.find((s) => s.roll === Number(roll));
  if (!student) return null;

  const subjects = subjectSets[className] || [];
  const base = 78 + student.roll * 4 + (examOffset[exam] || 0);
  const rows = subjects.map((subject, i) => {
    const obtained = Math.max(38, Math.min(97, base + ((i * 7) % 13) - 4));
    const { grade, point } = gradeOf(obtained);
    return { subject, full: 100, obtained, grade, point };
  });

  const total = rows.reduce((sum, r) => sum + r.obtained, 0);
  const fullTotal = rows.length * 100;
  const gpa = Math.min(5, rows.reduce((s, r) => s + r.point, 0) / rows.length);

  return {
    student: student.name,
    className,
    roll: student.roll,
    exam,
    fullTotal,
    total,
    gpa: gpa.toFixed(2),
    passed: rows.every((r) => r.grade !== "F"),
    rows,
  };
}

export const attendance = {
  "৬ষ্ঠ": { total: 120, present: 112, absent: 8 },
  "৭ম": { total: 120, present: 110, absent: 10 },
  "৮ম": { total: 118, present: 104, absent: 14 },
  "৯ম": { total: 124, present: 117, absent: 7 },
  "১০ম": { total: 126, present: 121, absent: 5 },
};

// শিক্ষার্থী নির্দেশিকা — ডেমো তথ্য
export const guidelines = [
  {
    id: 1,
    icon: "clock",
    title: "শ্রেণি কার্যক্রমের সময়",
    text: "প্রতিদিন সকাল ৮টা থেকে দুপুর ১টা ৩০ মিনিট পর্যন্ত শ্রেণি কার্যক্রম চলে। শিক্ষার্থীদের ১০ মিনিট পূর্বে উপস্থিত থাকতে হবে।",
  },
  {
    id: 2,
    icon: "attendance",
    title: "উপস্থিতি নীতিমালা",
    text: "প্রতিটি শ্রেণিতে ন্যূনতম ৮৫% উপস্থিতি বাধ্যতামূলক। অনুপস্থিতির ক্ষেত্রে অভিভাবকের লিখিত আবেদন প্রয়োজন।",
  },
  {
    id: 3,
    icon: "result",
    title: "পরীক্ষা ও মূল্যায়ন",
    text: "বছরে তিনটি সাময়িক পরীক্ষা ও নিয়মিত মডেল টেস্ট অনুষ্ঠিত হয়। ফলাফল অনলাইন পোর্টালে প্রকাশ করা হয়।",
  },
  {
    id: 4,
    icon: "cap",
    title: "শৃঙ্খলা ও পোশাক",
    text: "নির্ধারিত ইউনিফর্ম ও পরিচয়পত্র বহন বাধ্যতামূলক। ক্যাম্পাসে মোবাইল ফোন ব্যবহার নিরুৎসাহিত করা হয়।",
  },
];
