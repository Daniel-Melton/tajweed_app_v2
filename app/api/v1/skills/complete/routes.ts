import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, skillKey, stars } = body;

    if (!userId || !skillKey || stars === undefined) {
      return NextResponse.json({ status: 'error', message: 'بيانات ناقصة' }, { status: 400 });
    }

    // هنا يتم ربط قاعدة البيانات لاحقاً
    console.log(`[Server Log Check]: تم حفظ تقدم المستخدم ${userId} بنجاح في حكم ${skillKey} بـ ${stars} نجوم.`);

    return NextResponse.json({ status: 'success', message: 'Saved successfully' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}