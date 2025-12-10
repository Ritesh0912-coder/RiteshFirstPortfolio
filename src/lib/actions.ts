"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- NEWS ACTIONS ---

export async function createNews(formData: FormData) {
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const source = formData.get("source") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!title || !summary) {
        throw new Error("Title and Summary are required");
    }

    await db.news.create({
        data: {
            title,
            summary,
            content: content || summary,
            source: source || "UniverseHub Admin",
            imageUrl: imageUrl || "/images/news-placeholder.jpg",
            publishedAt: new Date(),
        },
    });

    revalidatePath("/news");
    revalidatePath("/admin/news");
    redirect("/admin/news");
}

export async function deleteNews(id: string) {
    await db.news.delete({
        where: { id },
    });

    revalidatePath("/news");
    revalidatePath("/admin/news");
}

// --- MISSION ACTIONS ---

export async function createMission(formData: FormData) {
    const name = formData.get("name") as string;
    const agency = formData.get("agency") as string;
    const status = formData.get("status") as string;
    const launchDate = formData.get("launchDate") as string;
    const description = formData.get("description") as string;

    if (!name || !status) {
        throw new Error("Name and Status are required");
    }

    await db.mission.create({
        data: {
            name,
            agency: agency || "Unknown",
            status: status || "PLANNED",
            launchDate: launchDate ? new Date(launchDate) : null,
            description: description || "",
        },
    });

    revalidatePath("/missions");
    revalidatePath("/admin/missions");
    redirect("/admin/missions");
}

export async function deleteMission(id: string) {
    await db.mission.delete({
        where: { id },
    });

    revalidatePath("/missions");
    revalidatePath("/admin/missions");
}

// --- USER ACTIONS ---

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { success: false, email: "", message: "Missing required fields" };
    }

    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { success: false, email: "", message: "User already exists" };
    }

    // TODO: Use bcrypt in production
    await db.user.create({
        data: {
            name,
            email,
            passwordHash: password,
            role: "USER",
            image: "",
        },
    });

    return { success: true, email, message: "Registration successful" };
}

export async function updateUser(formData: FormData) {
    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const email = formData.get("email") as string;

    if (!email) {
        throw new Error("Email is required");
    }

    await db.user.update({
        where: { email },
        data: {
            name,
            image,
        },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
