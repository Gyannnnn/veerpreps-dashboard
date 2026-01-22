export interface uploadTypesResponse {
    success: boolean,
    message: string
    data: {
        branches: [
            {
                branch_id: number,
                userid: string,
                displayimage: string
                branchname: string
                branchcode: string
            }
        ],
        subjects: [
            {
                subject_id: string,
                yearId: number,
                subjectname: string
                branchname: string
                iscommon: boolean,
                branchid: number
            }
        ]

    }
}