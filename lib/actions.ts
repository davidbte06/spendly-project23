"use server";

import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
    // 1. Extract data from the form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("This email is already registered.");
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save the new user to the database
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // 5. Redirect the user to the login page upon success
    redirect("/login");
}