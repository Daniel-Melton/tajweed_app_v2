import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phoneNumber, password } = await req.json();

    // 1. التحقق من إدخال البيانات الأساسية
    if (!name || !password || (!email && !phoneNumber)) {
      return NextResponse.json(
        { message: "الرجاء إدخال الاسم، كلمة المرور، ووسيلة اتصال واحدة على الأقل (هاتف أو إيميل)" },
        { status: 400 }
      );
    }

    // 2. التحقق مما إذا كان الحساب موجوداً مسبقاً (سواء بالإيميل أو الهاتف)
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingUserByEmail) {
        return NextResponse.json({ message: "هذا البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
      }
    }

    if (phoneNumber) {
      const existingUserByPhone = await prisma.user.findUnique({ where: { phoneNumber } });
      if (existingUserByPhone) {
        return NextResponse.json({ message: "رقم الهاتف هذا مسجل بالفعل" }, { status: 400 });
      }
    }

    // 3. تشفير كلمة المرور لحماية البيانات في Neon
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. حركة ذكية: التحقق هل هذا هو أول مستخدم في النظام؟
    const isFirstUser = (await prisma.user.count()) === 0;
    
    // إذا كان أول مستخدم يثبت كـ ADMIN (حضرتك)، وغير ذلك يكون STUDENT تلقائياً
    const finalRole = isFirstUser ? "ADMIN" : "STUDENT";

    // 5. حفظ المستخدم الجديد في قاعدة البيانات
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phoneNumber: phoneNumber || null,
        password: hashedPassword,
        role: finalRole,
      },
    });

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", user: { name: newUser.name, role: newUser.role } },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "حدث خطأ في السيرفر أثناء التسجيل" }, { status: 500 });
  }
}