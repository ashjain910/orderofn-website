// src/services/jobService.ts

export async function saveJob(jobId: number) {
    return fetch("/api/save-job", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: jobId, action: "save job" }),
    });
}
