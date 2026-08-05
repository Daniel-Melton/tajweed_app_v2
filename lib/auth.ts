import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // استخدام JSON Web Token لإدارة الجلسات بسرعة وكفاءة
  },
  pages: {
    signIn: "/login", // تحديد رابط صفحة تسجيل الدخول المخصصة التي سنبنيها
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("الرجاء إدخال جميع الحقول مطلوب");
        }

        // البحث عن المستخدم سواء بالإيميل أو برقم الهاتف لتسهيل الدخول على الطالبات
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phoneNumber: credentials.identifier }
            ]
          }
        });

        if (!user) {
          throw new Error("الحساب غير موجود، تأكدي من البيانات أو سجلي حساباً جديداً");
        }

        // التحقق من صحة كلمة المرور المشفرة
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        // إرجاع بيانات المستخدم بنجاح لتخزينها في الجلسة
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    // تمرير الصلاحيات (role) والـ id من قاعدة البيانات إلى الـ Token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    // جعل الصلاحيات متاحة في واجهة المستخدم (Client Side) لتعرف الجلسة هل هذا Admin أم طالبة
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    }
  }
};