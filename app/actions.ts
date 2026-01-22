"use server"

export async function addSubject(yearId: string, subjectName: string, branchName: string, branchId?: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Adding subject:", {
        yearId,
        subjectName,
        branchName,
        branchId,
    })

    // Dummy response
    return {
        success: true,
        message: `Subject '${subjectName}' added successfully to ${yearId} for ${branchName}`,
    }
}

export async function getSubjects(branchName: string, yearId: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log("Fetching subjects for:", { branchName, yearId })

    // Dummy data based on Year
    const subjects = {
        "First Year": ["Physics", "Chemistry", "Mathematics I", "Basic Electrical", "Engineering Graphics"],
        "Second Year": ["Data Structures", "Digital Logic", "Discrete Math", "COA", "OOPs"],
        "Pre-final Year": ["DBMS", "Operating Systems", "Computer Networks", "Algorithms", "Software Engineering"],
        "Final Year": ["Cloud Computing", "AI/ML", "Information Security", "Project Phase 1", "Project Phase 2"],
    }

    // Return subjects for the requested year, defaulting to empty array if not found
    return (subjects as any)[yearId] || []
}
