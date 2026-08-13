export interface LessonPosition {
  /** مركز بطاقة الورقة أفقيًا بالنسبة لعرض الحاوية الكلية (٪) */
  left: number;
  /** مركز بطاقة الورقة رأسيًا بالنسبة لارتفاع الحاوية الكلية (٪) */
  top: number;
  /** زاوية ميلان الورقة بالدرجات لتبدو طبيعية */
  rotate: number;
  /** رقم نسخة الساق (tile) اللي الورقة واقعة عليها — مفيد لأغراض تصحيح الأخطاء */
  tile: number;
  /**
   * صورة الورقة أصلًا عنيقها ناحية اليسار وطرفها المدبب ناحية اليمين
   * (مناسبة للأوراق على يمين الساق كما هي). للأوراق على يسار الساق
   * لازم نعكسها أفقيًا (scaleX(-1)) عشان العنيق يفضل قريب من الجذع.
   */
  flip: boolean;
}

/** نسبة أبعاد صورة الساق treev2.png (921×683) — نسخة واحدة (tile) */
export const TREE_ASPECT = 921 / 683;

/**
 * الساق الجديد عمودي وبيتكرر رأسيًا (background-repeat: repeat-y) عشان
 * يستوعب أي عدد دروس. بدل مواضع مطلقة على صورة واحدة، بنحسب مركز الساق
 * الفعلي (x%) عند نسب ارتفاع معينة *داخل نسخة واحدة* من الصورة
 * (تم استخراجها بتتبّع بكسلات الساق برمجيًا)، وبنولّد الورقة بإزاحة
 * يمين/يسار حوالين الساق بالتناوب.
 *
 * لو زاد عدد الدروس عن سعة النسخة الواحدة، بنكرر نفس النمط على نسخة
 * (tile) تانية من الصورة تحتها مباشرة (وهكذا)، مع عكس بداية التناوب
 * يمين/يسار في كل نسخة جديدة عشان يفضل الشكل متّسق بصريًا.
 */

/** نقاط الالتصاق بالساق داخل نسخة واحدة (٪ ارتفاع النسخة، ٪ أفقي الساق عندها) */
const STEM_ANCHORS: { atPct: number; stemX: number }[] = [
  { atPct: 7, stemX: 46.8 },
  { atPct: 21, stemX: 51.6 },
  { atPct: 35, stemX: 55.5 },
  { atPct: 50, stemX: 54.8 },
  { atPct: 64, stemX: 51.0 },
  { atPct: 78, stemX: 49.9 },
  { atPct: 92, stemX: 52.9 },
];

/** كام درس تقدر نسخة واحدة من الساق تستوعب براحة */
export const LEAVES_PER_TILE = STEM_ANCHORS.length;

/** إزاحة الورقة عن مركز الساق (٪ من عرض الحاوية) — بتختلف شوية لطبيعية أكتر */
const OFFSETS = [17, 17, 20, 20, 18, 18, 15];
/** زوايا الميلان المقابلة لكل نقطة (يسار سالب / يمين موجب) */
const ROTATIONS = [10, 9, 8, 11, 9, 10, 7];

/** كام نسخة (tile) من صورة الساق لازم نستخدم عشان نستوعب عدد الدروس ده */
export function getTileCount(total: number): number {
  return Math.max(1, Math.ceil(total / LEAVES_PER_TILE));
}

/**
 * توليد مواضع الأوراق لأي عدد دروس. الحاوية الكلية ارتفاعها
 * = عدد النسخ (tiles) × ارتفاع النسخة الواحدة، والنسب هنا كلها
 * بالنسبة للحاوية الكلية عشان تتحط مباشرة كـ style.top / style.left.
 */
export function getLessonPositions(total: number): LessonPosition[] {
  const tiles = Math.max(1, Math.ceil(total / LEAVES_PER_TILE));
  const positions: LessonPosition[] = [];

  for (let i = 0; i < total; i++) {
    const tile = Math.floor(i / LEAVES_PER_TILE);
    const indexInTile = i % LEAVES_PER_TILE;
    const anchor = STEM_ANCHORS[indexInTile];

    // نعكس بداية التناوب في كل نسخة جديدة عشان الشكل يفضل متزن
    const startsRight = tile % 2 === 1;
    const isRight = indexInTile % 2 === 0 ? startsRight : !startsRight;

    const offset = OFFSETS[indexInTile];
    const rotateMag = ROTATIONS[indexInTile];

    const top = ((tile + anchor.atPct / 100) / tiles) * 100;
    const left = isRight ? anchor.stemX + offset : anchor.stemX - offset;
    const rotate = isRight ? rotateMag : -rotateMag;

    positions.push({ left, top, rotate, tile, flip: !isRight });
  }

  return positions;
}
