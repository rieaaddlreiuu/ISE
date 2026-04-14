"use server";

import { redirect } from "next/navigation";
import { deleteProblemById } from "@/lib/problemDeletion";

export async function deleteProblemAction(formData: FormData) {
    const problemId = formData.get("problemId");

    if (typeof problemId !== "string" || problemId.trim().length === 0) {
        throw new Error("problemId is required");
    }

    await deleteProblemById(problemId.trim());
    redirect("/problems");
}
