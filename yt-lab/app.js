// مساعد عناصر
const $ = (sel) => document.querySelector(sel);

// حفظ تفضيلات بسيطة
const prefs = {
  get tone() { return localStorage.getItem("tone") || ""; },
  set tone(v) { localStorage.setItem("tone", v); },
};

window.addEventListener("DOMContentLoaded", () => {
  // تحميل التفضيلات
  $("#tone").value = prefs.tone;

  // أزرار عامة للنسخ/المسح
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (btn) {
      const target = document.querySelector(btn.getAttribute("data-copy"));
      if (target) {
        target.select();
        document.execCommand("copy");
        btn.textContent = "نُسِخ ✅";
        setTimeout(() => (btn.textContent = "نسخ"), 1200);
      }
    }
    const clearBtn = e.target.closest("[data-clear]");
    if (clearBtn) {
      const target = document.querySelector(clearBtn.getAttribute("data-clear"));
      if (target) target.value = "";
    }
  });

  // نسخ في بطاقات الأكواد
  document.querySelectorAll(".copy-btn").forEach((b) =>
    b.addEventListener("click", () => {
      const target = $(b.getAttribute("data-copy"));
      if (target) {
        const r = document.createRange();
        r.selectNodeContents(target);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        document.execCommand("copy");
        sel.removeAllRanges();
        b.textContent = "نُسِخ ✅";
        setTimeout(() => (b.textContent = "نسخ"), 1200);
      }
    })
  );

  // تشغيل سريع
  $("#quickStart").addEventListener("click", () => {
    $("#niche").focus();
    window.scrollTo({ top: $("#tools").offsetTop - 10, behavior: "smooth" });
  });

  // حفظ تفضيلات
  $("#savePrefs").addEventListener("click", () => {
    prefs.tone = $("#tone").value.trim();
    $("#saveMsg").textContent = "تم الحفظ محلياً.";
    setTimeout(() => ($("#saveMsg").textContent = ""), 1500);
  });

  // أدوات التوليد
  $("#genIdeasBtn").addEventListener("click", genIdeas);
  $("#genTitlesBtn").addEventListener("click", genTitles);
  $("#genDescTagsBtn").addEventListener("click", genDescTags);
  $("#genOutlineBtn").addEventListener("click", genOutline);
  $("#genThumbPromptBtn").addEventListener("click", genThumbPrompt);
  $("#genChaptersBtn").addEventListener("click", genChapters);
  $("#genScheduleBtn").addEventListener("click", genSchedule);
});

// 1) مولّد أفكار
function genIdeas() {
  const niche = $("#niche").value.trim() || "صنّاع المحتوى";
  const audience = $("#audience").value.trim() || "مبتدئون";
  const trends = $("#trends").value.trim();
  const tone = prefs.tone ? ` بأسلوب ${prefs.tone}` : "";
  const trendBits = trends ? trends.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [];
  const templates = [
    `هل حقاً يستحق {X} كل هذا الضجيج؟ تجربة {niche} للمرة الأولى`,
    `أفضل 7 حِيَل {niche} لا يعرفها {audience} في 2025`,
    `اختبار صريح: {X} ضد {Y} — من يفوز في {niche}?`,
    `{niche} من الصفر إلى الاحتراف في 10 دقائق (دليل {audience})`,
    `أخطاء قاتلة يرتكبها {audience} في {niche} (وتصحيح سريع)`,
    `تحدّي 24 ساعة: بناء مشروع {niche} من لا شيء`,
    `ما لا يقوله لك أحد عن {niche}: حقائق ونتائج`,
    `إعداداتي السرية لـ {niche} — انسخها اليوم`,
    `خطوة بخطوة: أول {niche} لك مع نتائج فورية`,
    `ردّي على أكبر 10 أسئلة من {audience} حول {niche}`,
    `تحويل فيديو عادي إلى Viral: خطة {niche} العملية`,
    `تجربة أدوات {niche}: هل {X} أفضل استثمار؟`,
  ];
  // حاول استخدام ترندات كمتغيرات
  const ideas = [];
  for (let i = 0; i < 10; i++) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    const X = trendBits[0] || "أداة جديدة";
    const Y = trendBits[1] || "بديل شهير";
    ideas.push(
      t
        .replaceAll("{niche}", niche)
        .replaceAll("{audience}", audience)
        .replaceAll("{X}", X)
        .replaceAll("{Y}", Y) + tone
    );
  }
  $("#ideasOut").value = ideas.map((v, idx) => `${idx + 1}. ${v}`).join("\n");
}

// 2) عناوين CTR
function genTitles() {
  const topic = $("#titleTopic").value.trim() || "موضوع فيديو قوي";
  const tone = prefs.tone ? ` | ${prefs.tone}` : "";
  const formulas = [
    `لن تصدّق: ${topic} في 60 ثانية`,
    `${topic} (الحقيقة الكاملة)`,
    `${topic} — الدليل السريع الذي تمنيتُ لو عرفته`,
    `جربت ${topic} لمدة 7 أيام: النتائج`,
    `${topic}: 5 أسرار لن يخبرك بها أحد`,
    `أسهل طريقة لـ ${topic} (بدون تعقيد)`,
    `${topic} للمبتدئين: من الصفر إلى الإتقان`,
    `${topic} في 3 خطوات فقط`,
    `قبل أن تبدأ بـ ${topic}… شاهد هذا`,
    `${topic} بمثال عملي واحد واضح`,
  ];
  $("#titlesOut").value = formulas.map((t, i) => `${i + 1}. ${t}${tone}`).join("\n");
}

// 3) وصف + وسوم
function genDescTags() {
  const summary = $("#descSummary").value.trim() || "فيديو يشرح موضوعاً عملياً مع أمثلة واضحة.";
  const tags = extractTags(summary);
  const desc = [
    `ملخص:`,
    cut(summary, 280),
    ``,
    `ماذا ستتعلم:`,
    `- نقاط عملية قابلة للتطبيق`,
    `- تجنب الأخطاء الشائعة`,
    `- أمثلة واقعية`,
    ``,
    `فصول:`,
    `00:00 مقدمة`,
    `00:30 النقطة الأولى`,
    `02:00 النقطة الثانية`,
    `04:00 الخلاصة`,
    ``,
    `روابط مفيدة:`,
    `- المادة المرافقة: (أضف الرابط)`,
    `- تابعني للمزيد: (أضف الرابط)`,
    ``,
    `لا تنسَ الاشتراك وتفعيل الجرس لتصلك أحدث الفيديوهات!`,
  ].join("\n");
  $("#descOut").value = desc;
  $("#tagsOut").value = tags.map(t => `#${t}`).join(" ");
}

function extractTags(text) {
  const words = text.toLowerCase()
    .replace(/[^
\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const freq = {};
  for (const w of words) {
    if (w.length < 3) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  const base = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([w])=>w);
  const enrich = ["youtube", "shorts", "tutorial", "arabic", "2025"];
  return Array.from(new Set([...base, ...enrich]));
}

function cut(s, max) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

// 4) هيكل السكربت
function genOutline() {
  const idea = $("#outlineIdea").value.trim() || "فكرة فيديو عامة";
  const outline = [
    `1) Hook قوي (0-10ث): وعد/نتيجة/سؤال`,
    `2) تأطير المشكلة: لماذا يهم ${idea}?`,
    `3) الخطة: ما الذي سنغطيه بسرعة`,
    `4) القيمة الأساسية (3 نقاط أساسية + مثال عملي)`,
    `5) الاعتراضات/الأخطاء الشائعة وكيف نتجنبها`,
    `6) الخلاصة: إعادة التذكير بالنقاط`,
    `7) CTA: اشترك + شاهد الفيديو المكمل`,
  ].join("\n");
  $("#outlineOut").value = outline;
}

// 5) برومبت المصغّرات
function genThumbPrompt() {
  const topic = $("#thumbTopic").value.trim() || "رسالة المصغّرة الأساسية";
  const style = $("#thumbStyle").value.trim() || "cinematic, bold colors";
  const prompt = [
    `YouTube thumbnail, 16:9, ${style},`,
    `big readable Arabic text, high contrast,`,
    `main subject: "${topic}" expressed visually,`,
    `dramatic lighting, sharp focus, studio grade,`,
    `clean background, clear composition --ar 16:9`,
    ``,
    `نص المقترح على المصغّرة (2-3 كلمات):`,
    `- ${shortenTopic(topic)}`,
    ``,
    `سلبيات (لتجنبها في SDXL):`,
    `- blur, low contrast, clutter, small text, watermark, logo`,
  ].join("\n");
  $("#thumbPromptOut").value = prompt;
}

function shortenTopic(t) {
  // يبسط الموضوع إلى 2-3 كلمات
  const parts = t.split(/\s+/).filter(Boolean).slice(0, 3);
  return parts.join(" ");
}

// 6) فصول تقريبية
function genChapters() {
  const transcript = $("#chaptersTranscript").value.trim();
  if (!transcript) {
    $("#chaptersOut").value = "ألصق التفريغ النصي أولاً.";
    return;
  }
  const chunks = chunkText(transcript, 350); // تقسيم كل ~350 حرفاً
  const total = chunks.length;
  const chapters = [];
  for (let i = 0; i < total; i++) {
    const t = toTime(Math.floor((i / total) * 8 * 60)); // يفترض طول 8 دقائق
    const title = summarizeChunk(chunks[i]);
    chapters.push(`${t} ${title}`);
  }
  $("#chaptersOut").value = chapters.join("\n");
}

function chunkText(s, size) {
  const res = [];
  for (let i = 0; i < s.length; i += size) res.push(s.slice(i, i + size));
  return res;
}
function toTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function summarizeChunk(s) {
  // تبسيط عنوان للقسم
  const sent = s.split(/[\.\!\؟\?]/)[0] || "قسم";
  return sent.trim().slice(0, 50) || "قسم";
}

// 7) جدول نشر
function genSchedule() {
  const perWeek = Math.max(1, Math.min(14, Number($("#perWeek").value) || 3));
  const pref = $("#preferredTime").value.trim();
  const slots = pref
    ? pref.split(/[,،]/).map(s => s.trim()).filter(Boolean)
    : ["الأحد 19:00", "الأربعاء 18:00", "الجمعة 17:00"];

  const now = new Date();
  const plan = [];
  let count = 0;
  const weeks = 4;
  for (let w = 0; w < weeks; w++) {
    plan.push(`# الأسبوع ${w + 1}`);
    for (let i = 0; i < slots.length && count < (w + 1) * perWeek; i++) {
      plan.push(`- ${slots[i]} — فيديو ${count + 1}`);
      count++;
    }
    plan.push("");
  }
  $("#scheduleOut").value = plan.join("\n");
}