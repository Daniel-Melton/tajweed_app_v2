export interface LessonPosition {
  /** مركز بطاقة الورقة أفقيًا بالنسبة لعرض الشجرة (٪) */
  left: number;
  /** مركز بطاقة الورقة رأسيًا بالنسبة لارتفاع الشجرة (٪) */
  top: number;
  /** زاوية ميلان الورقة بالدرجات لتبدو طبيعية */
  rotate: number;
}

/** نسبة أبعاد صورة الشجرة treev2.png (921×683) */
export const TREE_ASPECT = 921 / 683;

/**
 * مواضع الأوراق على الشجرة (treev2.png) — محسوبة من امتداد التاج الفعلي
 * حتى تقع كل ورقة داخل أوراق الشجرة، مع تناوب يمين/يسار وميلان واقعي.
 * الترتيب يطابق ترتيب الدروس (من الأعلى للأسفل).
 */
export const LESSON_POSITIONS: LessonPosition[] = [
  { left: 33.01, top: 15, rotate: -10 },
  { left: 42.56, top: 20, rotate: 8 },
  { left: 28.23, top: 25, rotate: -12 },
  { left: 74.7, top: 30, rotate: 10 },
  { left: 33.01, top: 35, rotate: -7 },
  { left: 78.39, top: 40, rotate: 13 },
  { left: 37.79, top: 45, rotate: -9 },
  { left: 77.31, top: 50, rotate: 11 },
  { left: 26.28, top: 55, rotate: -14 },
  { left: 43, top: 60, rotate: 6 },
  { left: 19.33, top: 65, rotate: -11 },
  { left: 54.72, top: 70, rotate: 12 },
  { left: 34.53, top: 75, rotate: -8 },
  { left: 42.35, top: 80, rotate: 9 },
];

/** مواضع الدروس وفقًا لعددها (يستخدم المواضع الثابتة، ويكمل توليدًا إن زاد العدد) */
export function getLessonPositions(total: number): LessonPosition[] {
  const positions = LESSON_POSITIONS.slice(0, total);
  while (positions.length < total) {
    const i = positions.length;
    positions.push({
      left: i % 2 === 0 ? 30 : 70,
      top: 15 + (i * 5) % 70,
      rotate: i % 2 === 0 ? -8 : 8,
    });
  }
  return positions;
}
