

export interface StatsRes{
    success: boolean;
    message: string;
    data: {
        users: number;
        pyqs: number;
        notes: number;
        videos: number;
    };
}


export interface Branch{
    branch_id: number;
    userid: string;
    displayimage: string;
    branchname: string;
    branchcode: string;
}

export interface BranchRes{
    branches: Branch[];
    message: string;
}