export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface AudioGuide {
  text: string;
  reciter: string;
  url: string;
}

export interface SkillDetails {
  id: string;
  title: string;
  concept: string;
  namingReason: string;
  importantWarning: string;
  analogy: string;
  videoUrl: string;
  audioGuides: AudioGuide[];
  quizPool: QuizQuestion[];
}

export const skillsDetailsBank: Record<string, SkillDetails> = {
  // === 1. الإظهار الحلقي ===
  noon_izhar: {
    id: "noon_izhar",
    title: "الإظهار الحلقي",
    concept: "إخراج النون الساكنة أو التنوين من مخرجها الواضح والنظيف دون زيادة في الغنة، إذا جاء بعدها أحد حروف الحلق الستة.",
    namingReason: "لأن جميع حروفه الستة (ء، هـ، ع، ح، غ، خ) تخرج من مخارج الحلق الثلاثة.",
    importantWarning: "احذري من فصل النون عن حرف الإظهار بسكتة طويلة، وتجنبي تمطيط صَوْت الغنة فيها.",
    analogy: "💡 مثل إشارة المرور الخضراء؛ تمر النون بوضوح ونطق صريح وسريع دون أي توقف أو انتظار!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "مِنْ حَكِيمٍ حَمِيدٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_izhar/hosary_1.mp3" },
      { text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_izhar/minshawi_1.mp3" },
      { text: "وَلَهُمْ عَذَابٌ أَلِيمٌ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_izhar/hosary_2.mp3" },
      { text: "مَنْ عَمِلَ صَالِحًا", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_izhar/minshawi_2.mp3" },
      { text: "وَالْمُنْخَنِقَةُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_izhar/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "iz_1", question: "ما هي حروف الإظهار الحلقي؟", options: [{ id: "a", text: "ء، هـ، ع، ح، غ، خ", isCorrect: true }, { id: "b", text: "ي، ر، م، ل، و، ن", isCorrect: false }] },
      { id: "iz_2", question: "حكم النون في كلمة (أَنْعَمْتَ) هو:", options: [{ id: "a", text: "إظهار حلقي", isCorrect: true }, { id: "b", text: "إخفاء حقيقي", isCorrect: false }] },
      { id: "iz_3", question: "لماذا سمي هذا الحكم بالإظهار الحلقي؟", options: [{ id: "a", text: "لأن حروفه تخرج من الحلق", isCorrect: true }, { id: "b", text: "لأن الحروف تخرج من الشفتين", isCorrect: false }] },
      { id: "iz_4", question: "ما هو الخطأ الشائع عند نطق الإظهار الحلقي؟", options: [{ id: "a", text: "عمل سكتة طويلة أو تمطيط الغنة", isCorrect: true }, { id: "b", text: "قصر المد الطبيعي", isCorrect: false }] },
      { id: "iz_5", question: "حكم التنوين في (عَذَابٌ أَلِيمٌ) هو:", options: [{ id: "a", text: "إظهار لوجود الهمزة", isCorrect: true }, { id: "b", text: "إدغام لوجود الميم", isCorrect: false }] },
      { id: "iz_6", question: "هل تظهر النون الساكنة في كلمة واحدة أم في كلمتين؟", options: [{ id: "a", text: "تظهر في كلمة واحدة وفي كلمتين", isCorrect: true }, { id: "b", text: "في كلمتين فقط", isCorrect: false }] },
      { id: "iz_7", question: "علامة الإظهار الحلقي للميم أو النون في المصحف هي وجود:", options: [{ id: "a", text: "رأس خاء صغيرة (سكون) فوق الحرف", isCorrect: true }, { id: "b", text: "تجريد الحرف من الحركات", isCorrect: false }] },
      { id: "iz_8", question: "أي من الكلمات التالية تحتوي على إظهار حلقي؟", options: [{ id: "a", text: "مَنْ خَشِيَ", isCorrect: true }, { id: "b", text: "مِن بَعْدِ", isCorrect: false }] },
      { id: "iz_9", question: "كم عدد حروف الإظهار الحلقي؟", options: [{ id: "a", text: "6 حروف", isCorrect: true }, { id: "b", text: "15 حرفاً", isCorrect: false }] },
      { id: "iz_10", question: "عند نطق الإظهار الحلقي، هل نخرج غنة طويلة؟", options: [{ id: "a", text: "لا، نخرج الحرف سريعاً وبانسيابية", isCorrect: true }, { id: "b", text: "نعم، بمقدار حركتين", isCorrect: false }] }
    ]
  },

  // === 2. الإدغام ===
  noon_idgham: {
    id: "noon_idgham",
    title: "الإدغام التفاعلي",
    concept: "دمج النون الساكنة أو التنوين في الحرف المتحرك الذي يليها تماماً بحيث يصيران حرفاً واحداً مشدداً، وذلك مع حروف (يرملون).",
    namingReason: "بسبب التماثل أو التقارب الشديد جداً في صفات ومخارج الحروف.",
    importantWarning: "احذري من إدغام النون إذا التقت بحرف الإدغام في كلمة واحدة (مثل: دُنْيا)؛ فهنا يجب الإظهار المطلق.",
    analogy: "💡 مثل دمج قطعتين من الصلصال الملون معاً؛ يمتزجان تماماً ليصبحا قطعة واحدة!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "مَن يَقُولُ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_idgham/minshawi_1.mp3" },
      { text: "مِن رَّبِّهِمْ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_idgham/hosary_1.mp3" },
      { text: "فَمَن يَعْمَلْ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_idgham/minshawi_2.mp3" },
      { text: "مِن مَّالٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_idgham/hosary_2.mp3" },
      { text: "هُدًى لِّلْمُتَّقِينَ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_idgham/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "id_1", question: "ما هي حروف الإدغام الكلية؟", options: [{ id: "a", text: "حروف كلمة (يرملون)", isCorrect: true }, { id: "b", text: "حروف كلمة (قطب جد)", isCorrect: false }] },
      { id: "id_2", question: "حكم النون الساكنة في كلمة (دُنْيا) هو:", options: [{ id: "a", text: "إظهار مطلق لأنها في كلمة واحدة", isCorrect: true }, { id: "b", text: "إدغام بغنة", isCorrect: false }] },
      { id: "id_3", question: "ما هما حرفا الإدغام بغير غنة؟", options: [{ id: "a", text: "اللام والراء (ل، ر)", isCorrect: true }, { id: "b", text: "الواو والياء (و، ي)", isCorrect: false }] },
      { id: "id_4", question: "حكم التنوين في (هُدًى لِّلْمُتَّقِينَ) هو:", options: [{ id: "a", text: "إدغام بغير غنة", isCorrect: true }, { id: "b", text: "إدغام بغنة", isCorrect: false }] },
      { id: "id_5", question: "ما هي حروف الإدغام بغنة؟", options: [{ id: "a", text: "حروف كلمة (ينمو)", isCorrect: true }, { id: "b", text: "الهمزة والعين", isCorrect: false }] },
      { id: "id_6", question: "عند إدغام النون في الراء (مِن رَّبِّهِمْ)، هل ننطق نون؟", options: [{ id: "a", text: "لا، ننطق راء مشددة فوراً", isCorrect: true }, { id: "b", text: "نعم، ننطق نون خفيفة", isCorrect: false }] },
      { id: "id_7", question: "كم حركة تمد غنة الإدغام في حروف (ينمو)؟", options: [{ id: "a", text: "حركتان", isCorrect: true }, { id: "b", text: "4 حركات", isCorrect: false }] },
      { id: "id_8", question: "أي من الكلمات التالية تحتوي على إدغام بغنة؟", options: [{ id: "a", text: "مَن يَقُولُ", isCorrect: true }, { id: "b", text: "قِنْوَان", isCorrect: false }] },
      { id: "id_9", question: "هل يجوز الإدغام إذا كان حرف المدغم وحرف الإدغام في كلمة واحدة؟", options: [{ id: "a", text: "لا يجوز، يجب الإظهار", isCorrect: true }, { id: "b", text: "نعم يجوز دائماً", isCorrect: false }] },
      { id: "id_10", question: "الإدغام في (مِن مَّالٍ) يعتبر إدغاماً:", options: [{ id: "a", text: "بغنة كامل", isCorrect: true }, { id: "b", text: "بغير غنة ناقص", isCorrect: false }] }
    ]
  },

  // === 3. القلب (الإقلاب) ===
  noon_iqlab: {
    id: "noon_iqlab",
    title: "القلب (الإقلاب)",
    concept: "قلب النون الساكنة أو التنوين إلى ميم خالصة برفق، ثم إخفاؤها مع غنة ظاهرة بمقدار حركتين إذا وقع بعدها حرف الباء.",
    namingReason: "لوجود صعوبة في النطق بالإظهار أو الإدغام عند التقاء النون بالباء.",
    importantWarning: "احذري من كزّ وضغط الشفتين بقوة مفرطة أثناء نطق الميم المقلوبة؛ الصواب تلامس بلطف.",
    analogy: "💡 مثل ارتداء قناع تنكري هادئ؛ النون موجودة بالداخل لكنها تظهر بصوت الميم الرقيقة!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "مِن بَعْدِ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_iqlab/hosary_1.mp3" },
      { text: "أَنبِئْهُم", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_iqlab/minshawi_1.mp3" },
      { text: "سَمِيعٌ بَصِيرٌ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_iqlab/hosary_2.mp3" },
      { text: "كِرَامٍ بَرَرَةٍ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_iqlab/minshawi_2.mp3" },
      { text: "مِنْ بَنَانٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_iqlab/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "iq_1", question: "ما هو الحرف الوحيد لحكم القلب؟", options: [{ id: "a", text: "حرف الباء (ب)", isCorrect: true }, { id: "b", text: "حرف الميم (م)", isCorrect: false }] },
      { id: "iq_2", question: "إلى أي حرف تقلب النون الساكنة والتنوين في الإقلاب؟", options: [{ id: "a", text: "ميم (م)", isCorrect: true }, { id: "b", text: "واو (و)", isCorrect: false }] },
      { id: "iq_3", question: "ما هي الطريقة الصحيحة لإطباق الشفتين في الإقلاب؟", options: [{ id: "a", text: "تلامس ولطف شديد بدون كز وضغط", isCorrect: true }, { id: "b", text: "الضغط بقوة لإخراج الميم", isCorrect: false }] },
      { id: "iq_4", question: "ما هي علامة الإقلاب في المصحف الشريف؟", options: [{ id: "a", text: "وضع ميم صغيرة قائمة (م) فوق النون", isCorrect: true }, { id: "b", text: "وضع حركة السكون المعتادة", isCorrect: false }] },
      { id: "iq_5", question: "حكم النون في كلمة (أَنْبِئْهُمْ) هو:", options: [{ id: "a", text: "إقلاب في كلمة واحدة", isCorrect: true }, { id: "b", text: "إظهار حلقي", isCorrect: false }] },
      { id: "iq_6", question: "كم حركة تمد غنة الإقلاب؟", options: [{ id: "a", text: "حركتان", isCorrect: true }, { id: "b", text: "أربع حركات", isCorrect: false }] },
      { id: "iq_7", question: "حكم التنوين في (سَمِيعٌ بَصِيرٌ) هو:", options: [{ id: "a", text: "إقلاب لوجود الباء", isCorrect: true }, { id: "b", text: "إخفاء شفوي", isCorrect: false }] },
      { id: "iq_8", question: "هل يقع الإقلاب في كلمة واحدة أم في كلمتين؟", options: [{ id: "a", text: "يقع في كلمة واحدة وفي كلمتين", isCorrect: true }, { id: "b", text: "في كلمة واحدة فقط", isCorrect: false }] },
      { id: "iq_9", question: "صوت الغنة في الإقلاب يخرج من:", options: [{ id: "a", text: "الخيشوم (الأنف)", isCorrect: true }, { id: "b", text: "جوف الفم فقط", isCorrect: false }] },
      { id: "iq_10", question: "أي الكلمات التالية مثال على الإقلاب في كلمتين؟", options: [{ id: "a", text: "مِن بَعْدِ", isCorrect: true }, { id: "b", text: "أَنبِئْهُم", isCorrect: false }] }
    ]
  },

  // === 4. الإخفاء الحقيقي ===
  noon_ikhfa: {
    id: "noon_ikhfa",
    title: "الإخفاء الحقيقي",
    concept: "نطق النون الساكنة بحالة متوسطة بين الإظهار والإدغام، مع بقاء غنة ظاهرة بمقدار حركتين عند حروف الإخفاء الـ 15.",
    namingReason: "لأن مخرج النون لم يبتعد جداً ولم يقترب جداً من حروف الإخفاء.",
    importantWarning: "احذري من إلصاق لسانك بسقف الحنك الأعلى عند نطق غنة الإخفاء؛ بل اتركيه معلقاً.",
    analogy: "💡 مثل الاختباء وراء ستارة شفافة؛ صوت الغنة يملأ المكان، وجسم النون مستور!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "أَنتُمْ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_ikhfa/minshawi_1.mp3" },
      { text: "مِن سِجِّيلٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_ikhfa/hosary_1.mp3" },
      { text: "عَن صَلَاتِهِمْ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/noon_ikhfa/minshawi_2.mp3" },
      { text: "قِنْوَانٌ دَانِيَةٌ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_ikhfa/hosary_2.mp3" },
      { text: "أَنجَيْنَاكُمْ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/noon_ikhfa/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "ikh_1", question: "كم عدد حروف الإخفاء الحقيقي؟", options: [{ id: "a", text: "15 حرفاً", isCorrect: true }, { id: "b", text: "6 حروف", isCorrect: false }] },
      { id: "ikh_2", question: "أين نضع اللسان أثناء أداء غنة الإخفاء الحقيقي؟", options: [{ id: "a", text: "نجعله معلقاً قريباً من مخرج الحرف القادم دون التصاق", isCorrect: true }, { id: "b", text: "نلصقه تماماً في أعلى الحنك كالمعتاد", isCorrect: false }] },
      { id: "ikh_3", question: "حكم النون في كلمة (أَنْتُمْ) هو:", options: [{ id: "a", text: "إخفاء حقيقي", isCorrect: true }, { id: "b", text: "إظهار حلقي", isCorrect: false }] },
      { id: "ikh_4", question: "تكون غنة الإخفاء الحقيقي مفخمة إذا جاء بعدها حرف مفخم مثل:", options: [{ id: "a", text: "الصاد والطاء (ص، ط)", isCorrect: true }, { id: "b", text: "السين والتاء (س، ت)", isCorrect: false }] },
      { id: "ikh_5", question: "تكون غنة الإخفاء مرققة إذا جاء بعدها حرف مرقق مثل:", options: [{ id: "a", text: "الكاف والتاء (ك، ت)", isCorrect: true }, { id: "b", text: "القاف والصاد (ق، ص)", isCorrect: false }] },
      { id: "ikh_6", question: "أي من الكلمات التالية فيها إخفاء حقيقي بغنة مفخمة؟", options: [{ id: "a", text: "مَنْ صَبَرَ", isCorrect: true }, { id: "b", text: "مِنْ سِجِّيلٍ", isCorrect: false }] },
      { id: "ikh_7", question: "حكم التنوين في (قِنْوَانٌ دَانِيَةٌ) هو:", options: [{ id: "a", text: "إخفاء حقيقي", isCorrect: true }, { id: "b", text: "إدغام بغنة", isCorrect: false }] },
      { id: "ikh_8", question: "لماذا سمي الإخفاء هنا بـ (الحقيقي)؟", options: [{ id: "a", text: "لأنه يتحقق فيه ستر جسم النون تماماً وبقاء صفتها", isCorrect: true }, { id: "b", text: "لأنه يخرج من الشفتين", isCorrect: false }] },
      { id: "ikh_9", question: "تجمع حروف الإخفاء الحقيقي في أوائل كلمات بيت الشعر:", options: [{ id: "a", text: "صف ذا ثنا كم جاد شخص قد سما...", isCorrect: true }, { id: "b", text: "أخي هاك علماً حازه غير خاسر", isCorrect: false }] },
      { id: "ikh_10", question: "مقدار زمن غنة الإخفاء الحقيقي هو:", options: [{ id: "a", text: "حركتان", isCorrect: true }, { id: "b", text: "لا توجد غنة", isCorrect: false }] }
    ]
  },

  // === 5. إدغام المثلين الصغير للميم ===
  meem_idgham: {
    id: "meem_idgham",
    title: "إدغام المثلين الصغير للميم",
    concept: "إدخال ميم ساكنة في ميم أخرى متحركة تأتي بعدها مباشرة، بحيث تصبحان ميماً واحدة مشددة مع إظهار غنة كاملة بمقدار حركتين.",
    namingReason: "بسبب التماثل التام والكامل بين الحرفين في المخرج والصفات.",
    importantWarning: "احذري من نطق الميمين منفصلتين؛ تأكدي من إطباق الشفتين إطباقاً تاماً.",
    analogy: "💡 مثل قفل ومفتاح متطابقين تماماً؛ يندمجان معاً ليقوما بوظيفة واحدة بانسيابية!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "وَلَهُم مَّا يَشْتَهُونَ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_idgham/hosary_1.mp3" },
      { text: "فِي قُلُوبِهِم مَّرَضٌ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/meem_idgham/minshawi_1.mp3" },
      { text: "أَطْعَمَهُم مِّن جُوعٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_idgham/hosary_2.mp3" },
      { text: "كَم مِّن فِئَةٍ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/meem_idgham/minshawi_2.mp3" },
      { text: "عَلَيْهِم مُّؤْصَدَةٌ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_idgham/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "mi_1", question: "متى يحدث حكم إدغام المثلين للميم الساكنة؟", options: [{ id: "a", text: "إذا جاء بعدها ميم متحركة", isCorrect: true }, { id: "b", text: "إذا جاء بعدها حرف نون", isCorrect: false }] },
      { id: "mi_2", question: "حكم الميم في (فِي قُلُوبِهِمْ مَرَضٌ) هو:", options: [{ id: "a", text: "إدغام مثلين صغير وغنة حركتين", isCorrect: true }, { id: "b", text: "إظهار شفوي", isCorrect: false }] },
      { id: "mi_3", question: "لماذا سمي هذا الحكم بـ (المثلين)؟", options: [{ id: "a", text: "لأن الحرفين متطابقان تماماً (ميم وميم)", isCorrect: true }, { id: "b", text: "لأنه يخرج من الحلق", isCorrect: false }] },
      { id: "mi_4", question: "تظهر علامة إدغام الميم الساكنة في المصحف على شكل:", options: [{ id: "a", text: "تجريد الميم الأولى من الحركة وتشديد الميم الثانية", isCorrect: true }, { id: "b", text: "وضع سكون فوق الميم الأولى", isCorrect: false }] },
      { id: "mi_5", question: "كم حركة تمد غنة إدغام المثلين الصغير؟", options: [{ id: "a", text: "حركتان", isCorrect: true }, { id: "b", text: "3 حركات", isCorrect: false }] },
      { id: "mi_6", question: "هل يقع إدغام المثلين الصغير للميم في كلمة واحدة؟", options: [{ id: "a", text: "لا، يقع في كلمتين فقط أن تكون الميم بنهاية الكلمة الأولى", isCorrect: true }, { id: "b", text: "نعم في كلمة واحدة دائماً", isCorrect: false }] },
      { id: "mi_7", question: "أي من الأمثلة التالية يمثل إدغام المثلين الصغير؟", options: [{ id: "a", text: "وَلَهُم مَّا يَشْتَهُونَ", isCorrect: true }, { id: "b", text: "تَرْمِيهِم بِحِجَارَةٍ", isCorrect: false }] },
      { id: "mi_8", question: "مخرج الميم المشددة الناتجة عن الإدغام يكون من:", options: [{ id: "a", text: "الشفتين مع غنة من الخيشوم", isCorrect: true }, { id: "b", text: "أقصى الحلق", isCorrect: false }] },
      { id: "mi_9", question: "ما معنى كلمة (الصغير) في إدغام المثلين الصغير؟", options: [{ id: "a", text: "لأن الحرف الأول ساكن والثاني متحرك", isCorrect: true }, { id: "b", text: "لأن صوت الغنة يكون قصيراً", isCorrect: false }] },
      { id: "mi_10", question: "إذا التقت ميم ساكنة بميم متحركة، النطق الصحيح يكون:", options: [{ id: "a", text: "ميماً واحدة مشددة مع غنة", isCorrect: true }, { id: "b", text: "نطق الميم الأولى ثم السكت ثم الثانية", isCorrect: false }] }
    ]
  },

  // === 6. الإخفاء الشفوي ===
  meem_ikhfa: {
    id: "meem_ikhfa",
    title: " can الإخفاء الشفوي للميم",
    concept: "ستر الميم الساكنة ونطقها بحالة بين الإظهار والإدغام مع بقاء الغنة بمقدار حركتين إذا جاء بعدها مباشرة حرف الباء.",
    namingReason: "لأن الميم والباء يخرجان معاً من الشفتين (الشفة).",
    importantWarning: "احذري من كز الشفتين بقوة مفرطة أو ترك فجوة واسعة؛ الصواب تلامس خفيف مريح.",
    analogy: "💡 مثل وضع لمسة حريرية ناعمة بين الشفتين؛ الصوت يتداخل بلطف ودون ضغط زائد!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "تَرْمِيهِم بِحِجَارَةٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_ikhfa/hosary_1.mp3" },
      { text: "وَمَا هُم بِمُؤْمِنِينَ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/meem_ikhfa/minshawi_1.mp3" },
      { text: "فَاحْكُم بَيْنَهُم", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_ikhfa/hosary_2.mp3" },
      { text: "يَعْتَصِم بِاللَّهِ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/meem_ikhfa/minshawi_2.mp3" },
      { text: "رَبَّهُم بِهِمْ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_ikhfa/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "mikh_1", question: "ما هو الحرف الوحيد للإخفاء الشفوي للميم الساكنة؟", options: [{ id: "a", text: "حرف الباء (ب)", isCorrect: true }, { id: "b", text: "حرف الميم (م)", isCorrect: false }] },
      { id: "mikh_2", question: "حكم الميم في (تَرْمِيهِمْ بِحِجَارَةٍ) هو:", options: [{ id: "a", text: "إخفاء شفوي بغنة حركتين", isCorrect: true }, { id: "b", text: "إخفاء حقيقي", isCorrect: false }] },
      { id: "mikh_3", question: "لماذا سمي هذا الحكم بـ (الشفوي) Hawk؟", options: [{ id: "a", text: "لأن الميم والباء يخرجان من الشفتين", isCorrect: true }, { id: "b", text: "لأنه يخرج من الجوف", isCorrect: false }] },
      { id: "mikh_4", question: "كيف نؤدي مخرج الشفتين في الإخفاء الشفوي؟", options: [{ id: "a", text: "تلامس لطيف وانطباق بدون ضغط وكز قوي", isCorrect: true }, { id: "b", text: "فتح الفم وترك فجوة كبيرة", isCorrect: false }] },
      { id: "mikh_5", question: "علامة الإخفاء الشفوي للميم في المصحف هي:", options: [{ id: "a", text: "تجريد الميم من الحركة وعدم تشديد الباء", isCorrect: true }, { id: "b", text: "وضع رأس خاء فوق الميم", isCorrect: false }] },
      { id: "mikh_6", question: "هل يقع الإخفاء الشفوي في كلمة واحدة؟", options: [{ id: "a", text: "لا، يقع في كلمتين فقط (الميم في كلمة والباء في الكلمة التالية)", isCorrect: true }, { id: "b", text: "نعم يقع في كلمة واحدة", isCorrect: false }] },
      { id: "mikh_7", question: "كم حركة تمد غنة الإخفاء الشفوي؟", options: [{ id: "a", text: "حركتان كاملتان", isCorrect: true }, { id: "b", text: "حركة واحدة سريعة", isCorrect: false }] },
      { id: "mikh_8", question: "أي من الأمثلة التالية مثال صحيح للإخفاء الشفوي؟", options: [{ id: "a", text: "وَمَا هُم بِمُؤْمِنِينَ", isCorrect: true }, { id: "b", text: "أَنْعَمْتَ", isCorrect: false }] },
      { id: "mikh_9", question: "ما الفرق بين الإخفاء الشفوي والإقلاب؟", options: [{ id: "a", text: "الإخفاء الشفوي الميم أصلية، أما الإقلاب الميم مقلوبة عن نون", isCorrect: true }, { id: "b", text: "لا يوجد أي فرق بينهما مطلقاً", isCorrect: false }] },
      { id: "mikh_10", question: "صوت غنة الإخفاء الشفوي يصاحبه صَوْت نقي يخرج من:", options: [{ id: "a", text: "الخيشوم", isCorrect: true }, { id: "b", text: "الحلق السفلي", isCorrect: false }] }
    ]
  },

  // === 7. الإظهار الشفوي ===
  meem_izhar: {
    id: "meem_izhar",
    title: "الإظهار الشفوي للميم",
    concept: "إخراج الميم الساكنة من مخرجها (الشفتين) واضحة وصريحة دون زيادة في الغنة، إذا جاء بعدها أي حرف عدا الباء والميم.",
    namingReason: "لأن الميم تظهر ناصعة من الشفتين عند التقائها بـ 26 حرفاً.",
    importantWarning: "احذري بشدة من إخفاء الميم إذا جاء بعدها حرف (الواو) أو (الفاء) لقرب مخرجهما.",
    analogy: "💡 مثل الصخرة الثابتة في مجرى الماء؛ تظهر الميم بقوة وصفاء دون دمج أو إخفاء!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "أَلَمْ تَرَ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_izhar/hosary_1.mp3" },
      { text: "تَمْسُونَ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/meem_izhar/minshawi_1.mp3" },
      { text: "عَلَيْهِمْ وَلاَ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_izhar/hosary_2.mp3" },
      { text: "لَكُمْ دِينُكُمْ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/meem_izhar/minshawi_2.mp3" },
      { text: "أَمْ لَمْ تُنذِرْهُمْ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/meem_izhar/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "miz_1", question: "ما هي حروف الإظهار الشفوي للميم الساكنة؟", options: [{ id: "a", text: "جميع حروف الهجاء عدا الباء والميم", isCorrect: true }, { id: "b", text: "حروف الحلق الستة فقط", isCorrect: false }] },
      { id: "miz_2", question: "لماذا يجب الحذر الشديد وإظهار الميم عند حرفي الواو والفاء؟", options: [{ id: "a", text: "لقرب مخرجهما واتحادهما مع الميم لمنع الإخفاء الخطأ", isCorrect: true }, { id: "b", text: "لأنهما من حروف الإدغام بغنة", isCorrect: false }] },
      { id: "miz_3", question: "حكم الميم في (لَكُمْ دِينُكُمْ) هو:", options: [{ id: "a", text: "إظهار شفوي صريح", isCorrect: true }, { id: "b", text: "إدغام مثلين", isCorrect: false }] },
      { id: "miz_4", question: "هل يقع الإظهار الشفوي للميم في كلمة واحدة؟", options: [{ id: "a", text: "نعم، يقع في كلمة واحدة (مثل: تَمْسُونَ) وفي كلمتين", isCorrect: true }, { id: "b", text: "في كلمتين فقط", isCorrect: false }] },
      { id: "miz_5", question: "علامة الإظهار الشفوي للميم في المصحف هي وجود:", options: [{ id: "a", text: "رأس خاء صغيرة (سكون) فوق الميم", isCorrect: true }, { id: "b", text: "تجريد الميم من أي حركة", isCorrect: false }] },
      { id: "miz_6", question: "كم عدد حروف الإظهار الشفوي للميم؟", options: [{ id: "a", text: "26 حرفاً", isCorrect: true }, { id: "b", text: "15 حرفاً", isCorrect: false }] },
      { id: "miz_7", question: "حكم الميم في (عَلَيْهِمْ وَلَا الضَّالِّينَ) هو:", options: [{ id: "a", text: "إظهار شفوي شديد التحذير لوجود الواو", isCorrect: true }, { id: "b", text: "إخفاء شفوي لوجود الواو", isCorrect: false }] },
      { id: "miz_8", question: "عند نطق الإظهار الشفوي للميم، هل نزيد زمن الغنة؟", options: [{ id: "a", text: "لا، تخرج الميم بزمن سكونها الطبيعي بدون تطويل", isCorrect: true }, { id: "b", text: "نعم نمدها حركتين كاملتين", isCorrect: false }] },
      { id: "miz_9", question: "أي من الكلمات التالية تحتوي على إظهار شفوي في كلمة واحدة؟", options: [{ id: "a", text: "تَمْسُونَ", isCorrect: true }, { id: "b", text: "أَلَمْ تَرَ", isCorrect: false }] },
      { id: "miz_10", question: "عند التقاء الميم الساكنة بحرف التاء، الحكم يكون:", options: [{ id: "a", text: "إظهار شفوي", isCorrect: true }, { id: "b", text: "إخفاء حقيقي", isCorrect: false }] }
    ]
  },

  // === 8. المد الطبيعي الأصلي ===
  madd_tabeei: {
    id: "madd_tabeei",
    title: "المد الطبيعي الأصلي",
    concept: "إطالة الصوت بحرف من حروف المد الثلاثة (الألف، الواو، الياء) إطالة طبيعية لا تقوم ذات الحرف إلا بها، بمقدار حركتين.",
    namingReason: "لأن صاحب الطبع السليم لا ينقصه عن حركتين ولا يزيده عليهما.",
    importantWarning: "تجنبي بتر أو قصر المد الطبيعي ليصبح كالحركة السريعة، وتجنبي زيادة طوله.",
    analogy: "💡 مثل خطوات المشي الهادئة والمنتظمة؛ خطوتان كاملتان لا تسرع فيهما ولا تباطؤ!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "قَالَ يَا نُوحُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/madd_tabeei/hosary_1.mp3" },
      { text: "فِيهَا صَلَاحٌ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/madd_tabeei/minshawi_1.mp3" },
      { text: "يَقُولُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/madd_tabeei/hosary_2.mp3" },
      { text: "مَالِكِ يَوْمِ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/madd_tabeei/minshawi_2.mp3" },
      { text: "يُوصِيكُمُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/madd_tabeei/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "mt_1", question: "ما هي حروف المد الثلاثة؟", options: [{ id: "a", text: "الألف، الواو، الياء (بشروطها)", isCorrect: true }, { id: "b", text: "الهمزة والعين والحاء", isCorrect: false }] },
      { id: "mt_2", question: "كم مقدار مد الصوت في المد الطبيعي الأصلي؟", options: [{ id: "a", text: "حركتان فقط", isCorrect: true }, { id: "b", text: "4 أو 5 حركات", isCorrect: false }] },
      { id: "mt_3", question: "لماذا سمي هذا المد بالمد الطبيعي؟", options: [{ id: "a", text: "لأن صاحب الطبع السليم بمقدار حركتين تلقائياً", isCorrect: true }, { id: "b", text: "لأنه لا يحتاج إلى نطق قوي", isCorrect: false }] },
      { id: "mt_4", question: "شروك حروف المد هي أن تكون ساكنة وحركة الحرف قبلها:", options: [{ id: "a", text: "مجانسة لها (الفتح قبل الألف، الضم قبل الواو، الكسر قبل الياء)", isCorrect: true }, { id: "b", text: "دائماً فتحة فوق كل الحروف", isCorrect: false }] },
      { id: "mt_5", question: "كلمة (نُوحِيهَا) تجمع حروف المد الثلاثة، فكم مداً طبيعياً بها؟", options: [{ id: "a", text: "3 مدود طبيعية وكل واحد حركتان", isCorrect: true }, { id: "b", text: "مد واحد فقط", isCorrect: false }] },
      { id: "mt_6", question: "ما هو الخطأ الشائع عند نطق المد الطبيعي؟", options: [{ id: "a", text: "بتره وقصره كالحركة الفتحة والضمة السريعة", isCorrect: true }, { id: "b", text: "إعطاؤه حركتين كاملتين", isCorrect: false }] },
      { id: "mt_7", question: "هل يحتاج المد الطبيعي الأصلي إلى سبب مثل الهمزة أو السكون؟", options: [{ id: "a", text: "لا يحتاج لأي سبب خارجي لمدّه", isCorrect: true }, { id: "b", text: "نعم يحتاج لوجود همزة بعده", isCorrect: false }] },
      { id: "mt_8", question: "المد في كلمة (قَالَ) يعتبر مداً:", options: [{ id: "a", text: "طبيعياً أصلياً بمقدار حركتين", isCorrect: true }, { id: "b", text: "واجباً متصلاً", isCorrect: false }] },
      { id: "mt_9", question: "إذا نقص مقدار المد الطبيعي عن حركتين، فما النتيجة؟", options: [{ id: "a", text: "يسقط حرف المد ويتحول لحركة قصيرة خطأ", isCorrect: true }, { id: "b", text: "يصبح النطق أكثر فصاحة", isCorrect: false }] },
      { id: "mt_10", question: "الواو في كلمة (يَقُولُ) تمد بمقدار حركتين بشرط:", options: [{ id: "a", text: "أن تكون ساكنة وما قبلها مضموم", isCorrect: true }, { id: "b", text: "أن تكون مفتوحة وما قبلها ساكن", isCorrect: false }] }
    ]
  },

  // === 9. المد الواجب المتصل ===
  madd_muttasil: {
    id: "madd_muttasil",
    title: "المد الواجب المتصل",
    concept: "أن يأتي حرف المد وبعده مباشرة همزة في كلمة واحدة، ويمد بمقدار 4 أو 5 حركات وجوباً.",
    namingReason: "لاتصال حرف المد بالهمزة ووجودهما معاً داخل كلمة واحدة.",
    importantWarning: "احذري من قصر هذا المد لحركتين؛ حكمه المد الوجوبي.",
    analogy: "💡 مثل السهم المنطلق؛ يمتد الصوت طويلاً ليصيب هدف الهمزة في نهاية الكلمة الكبيرة!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "جَاءَ نَصْرُ اللَّهِ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/madd_muttasil/hosary_1.mp3" },
      { text: "السَّمَاءِ مَاءً", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/madd_muttasil/minshawi_1.mp3" },
      { text: "وَالْمَلَائِكَةُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/madd_muttasil/hosary_2.mp3" },
      { text: "سِيئَتْ وُجُوهُ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/madd_muttasil/minshawi_2.mp3" },
      { text: "أُولَئِكَ هُمْ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/madd_muttasil/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "mm_1", question: "لماذا سمي هذا المد بـ (المتصل)؟", options: [{ id: "a", text: "لأن حرف المد والهمزة في كلمة واحدة", isCorrect: true }, { id: "b", text: "لأن الكلمة متصلة بالكلمة القادمة", isCorrect: false }] },
      { id: "mm_2", question: "كم مقدار مد الصوت في المد الواجب المتصل لحفص؟", options: [{ id: "a", text: "4 أو 5 حركات", isCorrect: true }, { id: "b", text: "حركتان فقط", isCorrect: false }] },
      { id: "mm_3", question: "ما حكم المد المتصل من حيث الوجوب والجواز؟", options: [{ id: "a", text: "واجب المد عند جميع القراء ولا يجوز قصره", isCorrect: true }, { id: "b", text: "جائز يجوز مدّه وقصره", isCorrect: false }] },
      { id: "mm_4", question: "أي من الكلمات التالية مثال على المد الواجب المتصل؟", options: [{ id: "a", text: "السَّمَاءِ", isCorrect: true }, { id: "b", text: "فِي أُمِّهَا", isCorrect: false }] },
      { id: "mm_5", question: "ما هو سبب الزيادة في المد الواجب المتصل عن الحركتين؟", options: [{ id: "a", text: "مجيء الهمزة مباشرة بعد حرف المد", isCorrect: true }, { id: "b", text: "مجيء حرف السكون", isCorrect: false }] },
      { id: "mm_6", question: "المد في كلمة (جَاءَ) يمد بمقدار:", options: [{ id: "a", text: "4 أو 5 حركات وجوباً", isCorrect: true }, { id: "b", text: "حركتين جوازاً", isCorrect: false }] },
      { id: "mm_7", question: "تظهر علامة المد الزائد في المصحف على شكل:", options: [{ id: "a", text: "موجة أو حواجب طايرة فوق حرف المد (~)", isCorrect: true }, { id: "b", text: "وضع سكون دائري فوق الحرف", isCorrect: false }] },
      { id: "mm_8", question: "هل يجوز قصر المد المتصل إلى حركتين عند القراءة برواية حفص عن عاصم من طريق الشاطبية؟", options: [{ id: "a", text: "لا يجوز مطلقاً، وقصره يعتبر خطأ تجويدياً", isCorrect: true }, { id: "b", text: "نعم يجوز عند السرعة", isCorrect: false }] },
      { id: "mm_9", question: "المد في كلمة (أُولَئِكَ) نوعه:", options: [{ id: "a", text: "مد واجب متصل", isCorrect: true }, { id: "b", text: "مد منفصل", isCorrect: false }] },
      { id: "mm_10", question: "إذا جاءت الهمزة متطرفة في نهاية الكلمة ووقفنا عليها (مثل: السَّمَاء)، كم حركة يجوز مدّه؟", options: [{ id: "a", text: "يجوز مدّه إلى 6 حركات بسبب السكون العارض للوقف", isCorrect: true }, { id: "b", text: "حركتين فقط", isCorrect: false }] }
    ]
  },

  // === 10. حكم القلقلة ===
  qalqalah: {
    id: "qalqalah",
    title: "حكم القلقلة الاهتزازي",
    concept: "اضطراب واهتزاز المخرج عند النطق بالحرف الساكن من حروف (قُطْبُ جَدٍ) حتى يُسمع له نبرة قوية واضحة.",
    namingReason: "من الحركة والاضطراب؛ فاللسان أو المخرج يتقلقل ويهتز بقوة لخروج الحرف محبوساً ونظيفاً.",
    importantWarning: "احذري من خلط صَوْت القلقلة بحركة ككسرة أو فتحة، أو إنهاء صوت الحرف بهمزة زائدة.",
    analogy: "💡 مثل ارتداد الكرة المطاطية عند اصطدامها بالجدار؛ تعود فوراً بنبرة قوية واهتزاز سريع وتلقائي!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "الْفَلَقِ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/qalqalah/hosary_1.mp3" },
      { text: "الْمَوْعُودِ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/qalqalah/minshawi_1.mp3" },
      { text: "حَبْلٌ مِّن مَّسَدٍ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/qalqalah/hosary_2.mp3" },
      { text: "خَلَقْنَا الإِنسَانَ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/qalqalah/minshawi_2.mp3" },
      { text: "الْبُرُوجِ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/qalqalah/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "qa_1", question: "ما هي حروف القلقلة؟", options: [{ id: "a", text: "حروف كلمة (قُطْبُ جَدٍ)", isCorrect: true }, { id: "b", text: "حروف كلمة (يرملون)", isCorrect: false }] },
      { id: "qa_2", question: "شرط قلقلة الحرف هو أن يكون:", options: [{ id: "a", text: "ساكناً (سواء سكون أصلي أو عارض بسبب الوقف)", isCorrect: true }, { id: "b", text: "متحركاً بالفتح والضم", isCorrect: false }] },
      { id: "qa_3", question: "متى تكون القلقلة (كبرى) قوية جداً ونبرتها عالية؟", options: [{ id: "a", text: "إذا كان حرف القلقلة في نهاية الكلمة وقفنا عليه", isCorrect: true }, { id: "b", text: "إذا كان في وسط الكلمة", isCorrect: false }] },
      { id: "qa_4", question: "متى تكون القلقلة (صغرى) انسيابية وسريعة؟", options: [{ id: "a", text: "إذا جاء حرف القلقلة ساكناً في وسط الكلمة (مثل: خَلَقْنَا)", isCorrect: true }, { id: "b", text: "إذا كان مشدداً في نهاية الكلمة", isCorrect: false }] },
      { id: "qa_5", question: "المد والتطبيق في كلمة (الْفَلَقِ) عند الوقف عليها يمثل قلقلة:", options: [{ id: "a", text: "كبرى", isCorrect: true }, { id: "b", text: "صغرى", isCorrect: false }] },
      { id: "qa_6", question: "القلقلة في كلمة (يَجْعَلُونَ) تعتبر قلقلة:", options: [{ id: "a", text: "صغرى لوجود الجيم ساكنة في وسط الكلمة", isCorrect: true }, { id: "b", text: "كبرى", isCorrect: false }] },
      { id: "qa_7", question: "ما هو الخطأ الشائع عند أداء حكم القلقلة؟", options: [{ id: "a", text: "مالتها وخلطها بحركة كالفتح أو الكسر الخطأ", isCorrect: true }, { id: "b", text: "اهتزاز المخرج بصفاء", isCorrect: false }] },
      { id: "qa_8", question: "أي من الكلمات التالية تحتوي على قلقلة صغرى؟", options: [{ id: "a", text: "يَقْطَعُونَ", isCorrect: true }, { id: "b", text: "عَذَابٌ شَدِيدٌ (عند الوقف)", isCorrect: false }] },
      { id: "qa_9", question: "معنى كلمة القلقلة لغةً واصطلاحاً هو:", options: [{ id: "a", text: "الاضطراب والتحريك لاهتزاز المخرج", isCorrect: true }, { id: "b", text: "الستر والخفاء والهدوء", isCorrect: false }] },
      { id: "qa_10", question: "عند الوقف على كلمة (بِالْحَقِّ) المشددة، تكون القلقلة:", options: [{ id: "a", text: "أعلى درجات الكبرى (أشد) لأنه موقوف على مشدد", isCorrect: true }, { id: "b", text: "صغرى خفيفة", isCorrect: false }] }
    ]
  },

  // === 11. مخارج الحروف العامة ===
  makhaarij: {
    id: "makhaarij",
    title: "مخارج الحروف العامة",
    concept: "محل وخروج الحرف وتميزه بصمته وصوته عن غيره، والمخارج الرئيسية خمسة: الجوف، الحلق، اللسان، الشفتان، الخيشوم.",
    namingReason: "لأنها الأماكن الجغرافية التي ينقطع عندها صَوْت الهواء ليتشكل الحرف القرآني النظيف.",
    importantWarning: "احذري من خلط مخارج الحروف المتقاربة مثل الضاد والظاء، أو الثاء والسين.",
    analogy: "💡 مثل بوابات الخروج في المطار; كل حرف له بوابة خاصة منظم يخرج منها ولا يتعدى على بوابة غيره!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "الْحَمْدُ لِلَّهِ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/makhaarij/hosary_1.mp3" },
      { text: "الرَّحْمَنِ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/makhaarij/minshawi_1.mp3" },
      { text: "إِيَّاكَ نَعْبُدُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/makhaarij/hosary_2.mp3" },
      { text: "اهْدِنَا الصِّرَاطَ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/makhaarij/minshawi_2.mp3" },
      { text: "وَالنَّاسِ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/makhaarij/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "ma_1", question: "كم عدد المخارج الرئيسية العامة لحروف الهجاء؟", options: [{ id: "a", text: "5 مخارج عامة رئيسية", isCorrect: true }, { id: "b", text: "3 مخارج فقط", isCorrect: false }] },
      { id: "ma_2", question: "ما هو المخرج المسؤول عن خروج صوت الغنة؟", options: [{ id: "a", text: "الخيشوم (الأنف)", isCorrect: true }, { id: "b", text: "اللسان والجوف", isCorrect: false }] },
      { id: "ma_3", question: "الحروف الجوفية (حروف المد الثلاثة) تخرج من مخرج:", options: [{ id: "a", text: "الجوف (خلاء الفم والحلق)", isCorrect: true }, { id: "b", text: "الشفتين انطباقاً", isCorrect: false }] },
      { id: "ma_4", question: "كم مخرجاً خاصاً يحتوي عليه مخرج الحلق؟", options: [{ id: "a", text: "3 مخارج خاصة (أقصى، وسط، أدنى الحلق)", isCorrect: true }, { id: "b", text: "مخرج واحد فقط شامل", isCorrect: false }] },
      { id: "ma_5", question: "الحروف (أ، هـ) تخرج من مخرج:", options: [{ id: "a", text: "أقصى الحلق (أبعد منطقة عن الفم)", isCorrect: true }, { id: "b", text: "طرق اللسان", isCorrect: false }] },
      { id: "ma_6", question: "أكبر مخرج عام ويخرج منه أكبر عدد من الحروف (18 حرفاً) هو:", options: [{ id: "a", text: "اللسان", isCorrect: true }, { id: "b", text: "الجوف الشامل", isCorrect: false }] },
      { id: "ma_7", question: "حروف الشفتين العامة الأربعة هي:", options: [{ id: "a", text: "الباء، الميم، الواو، الفاء (ب، م، و، ف)", isCorrect: true }, { id: "b", text: "التاء، الثاء، الدال", isCorrect: false }] },
      { id: "ma_8", question: "كيف يمكنكِ معرفة المخرج الدقيق لأي حرف؟", options: [{ id: "a", text: "تسكين الحرف وإدخال همزة وصل مكسورة قبل وسماع انقطاع الصوت", isCorrect: true }, { id: "b", text: "نطقه متحركاً بالفتح سريعاً", isCorrect: false }] },
      { id: "ma_9", question: "المخرج العام الذي لا يحتوي على مخارج خاصة محددة البقعة هو:", options: [{ id: "a", text: "الجوف (لأنه مخرج مقدر للهواء)", isCorrect: true }, { id: "b", text: "الحلق الصريح", isCorrect: false }] },
      { id: "ma_10", question: "حرفا (العين والحاء) يخرجان من بقعة عادلة في الحلق وهي:", options: [{ id: "a", text: "وسط الحلق", isCorrect: true }, { id: "b", text: "أدنى الحلق القريب من الفم", isCorrect: false }] }
    ]
  },

  // === 12. صفات الحروف ===
  sifaat: {
    id: "sifaat",
    title: "صفات الحروف (الاستعلاء والاستفال)",
    concept: "الهيئة التي يظهر بها الحرف عند خروجه من مخرجه، وتنقسم لصفات لها ضد (كالهمس والجهر) وصفات لا ضد لها.",
    namingReason: "لتوضيح وتحسين جودة صوت الحرف وتفريقه التام عن الحروف الأخرى المشاركة له في نفس المخرج.",
    importantWarning: "احذري من تفخيم الحرف المستفل المرقق إذا جاور حرفاً مستعلياً مفخماً.",
    analogy: "💡 مثل الملابس والسمات الشخصية؛ المخرج يعطيك الحرف، والصفة هي الثوب الجمالي التجويدي الذي يرتديه هذا الحرف!",
    videoUrl: "https://www.youtube.com/embed/SshMvP6IubM",
    audioGuides: [
      { text: "خَلَقَ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/sifaat/hosary_1.mp3" },
      { text: "إِيَّاكَ نَعْبُدُ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/sifaat/minshawi_1.mp3" },
      { text: "الصِّرَاطَ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/sifaat/hosary_2.mp3" },
      { text: "وَلَا الضَّالِّينَ", reciter: "الشيخ محمد صديق المنشاوي", url: "/audio/sifaat/minshawi_2.mp3" },
      { text: "يُرِيدُ اللَّهُ", reciter: "الشيخ محمود خليل الحصري", url: "/audio/sifaat/hosary_3.mp3" }
    ],
    quizPool: [
      { id: "sf_1", question: "ما فائدة تعلم صفات الحروف التجويدية الدقيقة؟", options: [{ id: "a", text: "تميز الحروف المشتركة في المخرج وتحسين النطق الشريف", isCorrect: true }, { id: "b", text: "معرفة زمن المدود الطويلة فقط", isCorrect: false }] },
      { id: "sf_2", question: "ما هي حروف الاستعلاء (التفخيم القوي دائماً)؟", options: [{ id: "a", text: "حروف جملة (خُصَّ ضَغْطٍ قِظْ)", isCorrect: true }, { id: "b", text: "حروف كلمة (ينمو)", isCorrect: false }] },
      { id: "sf_3", question: "معنى صفة (الاستفال) للحرف التجويدي هو:", options: [{ id: "a", text: "انخفاض اللسان وترقيق صوت الحرف انسيابياً لطيفاً", isCorrect: true }, { id: "b", text: "تسمين الحرف وامتلاء الفم بالصدى", isCorrect: false }] },
      { id: "sf_4", question: "ما هو الخطأ الشائع عند نطق حرف مستفل مرقق بجانب حرف مفخم؟", options: [{ id: "a", text: "تفخيم الحرف المرقق تبعاً للمفخم (مثل نطق التاء كأنها طاء في طَلَقَ)", isCorrect: true }, { id: "b", text: "عزل صوتهما وترقيق التاء واضحة", isCorrect: false }] },
      { id: "sf_5", question: "تجمع حروف صفة الهمس (جريان وتدفق الهواء خلف الحرف) في كلمات:", options: [{ id: "a", text: "فحثه شخص سكت", isCorrect: true }, { id: "b", text: "قطب جد القوية", isCorrect: false }] },
      { id: "sf_6", question: "حرف الراء يعتبر حرفاً بين التفخيم والترقيق حسب:", options: [{ id: "a", text: "حركته وحركة ما قبله (مفتوح ومضموم يفخم، مكسور يرقق)", isCorrect: true }, { id: "b", text: "مكانه في أول السورة فقط", isCorrect: false }] },
      { id: "sf_7", question: "صفة القلقلة التي درسناها سابقاً تعتبر من الصفات:", options: [{ id: "a", text: "التي لا ضد لها", isCorrect: true }, { id: "b", text: "التي لها ضد قوي", isCorrect: false }] },
      { id: "sf_8", question: "أقوى حروف الهجاء تفخيماً وقوة في الصفات والمخرج هو حرف:", options: [{ id: "a", text: "الطاء (ط)", isCorrect: true }, { id: "b", text: "السين (س)", isCorrect: false }] },
      { id: "sf_9", question: "عند نطق حرف الخاء في (خَلَقَ)، الصوت يكون:", options: [{ id: "a", text: "مفخماً مستعلياً ممتلئ الفم بالصدى", isCorrect: true }, { id: "b", text: "مرققاً نحيفاً خفيفاً", isCorrect: false }] },
      { id: "sf_10", question: "جريان الصوت (الرخاوة) وانحباس الصوت (الشدة) يمثلان صفات:", options: [{ id: "a", text: "متضادة تعتمد على قوة المخرج وانحباس صوته وهواؤه", isCorrect: true }, { id: "b", text: "مخارج عامة فقط", isCorrect: false }] }
    ]
  }
};

export const mockRoadmapData = skillsDetailsBank;