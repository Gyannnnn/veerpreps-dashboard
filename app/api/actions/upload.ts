"use server";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { auth } from "@/auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAuthHeaders() {
  const session = await auth();
  // console.log("Upload Action Session:", JSON.stringify(session, null, 2));

  const token = (session as any)?.accessToken;

  if (!token) {
    console.error("Session access token missing");
    throw new Error("Unauthorized: No access token");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function uploadNote(
  formData: FormData,
  subjectid: string
): Promise<{ success: true; file: any }> {
  const file = formData.get("notespdf") as File;
  const filename = formData.get("notesname") as string;
  const parsedSubjectId = parseInt(subjectid);
  const cleanFileName = filename.replace(/\s+/g, "-").toLowerCase();
  const extension = path.extname(file.name);

  if (!file || !filename || !subjectid) {
    throw new Error("Missing file or required fields");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/notes/${cleanFileName}-${Date.now()}${extension}`;
  const bucket = process.env.AWS_S3_BUCKET_NAME!;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: "application/pdf",
      })
    );

    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const headers = await getAuthHeaders();

    const response = await axios.post(
      `${API_URL}/api/notes/create`,
      { subjectId: parsedSubjectId, link: url, notesname: filename },
      { headers }
    );

    return { success: true, file: response.data };
  } catch (error) {
    const err = error as Error;
    console.error("Notes upload error:", err);
    throw new Error(err.message || "Upload or creation failed");
  }
}

export async function uploadPyq(
  formData: FormData,
  subjectid: string
): Promise<{ success: true; file: any }> {
  const file = formData.get("pyqpdf") as File;
  const filename = formData.get("pyqname") as string;
  const pyqyear = formData.get("pyqyear") as string;
  const pyqtype = formData.get("pyqtype") as string;
  const formSubjectId = formData.get("subjectid") as string;

  const extension = path.extname(file.name);
  const cleanFileName = filename.replace(/\s+/g, "-").toLowerCase();

  if (!file || !filename || !pyqyear || !pyqtype || !formSubjectId) {
    throw new Error("Missing file or required fields");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/pyqs/${cleanFileName}-${Date.now()}${extension}`;
  const bucket = process.env.AWS_S3_BUCKET_NAME!;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const headers = await getAuthHeaders();

    console.log("Uploading to:", `${API_URL}/api/pyq/create`);
    const response = await axios.post(
      `${API_URL}/api/pyq/create`,
      {
        pyqname: filename,
        pyqyear: pyqyear,
        subjectId: parseInt(formSubjectId),
        links: url,
        pyqtype: pyqtype,
      },
      { headers }
    );

    return { success: true, file: response.data };
  } catch (error) {
    const err = error as Error;
    console.error("PYQ upload error:", err);
    throw new Error(err.message || "Upload or creation failed");
  }
}

export async function uploadYoutubeVideo(
  formData: FormData,
  subjectid: string
): Promise<{ success: true; file: any }> {
  const videoname = formData.get("videoname") as string;
  const link = formData.get("link") as string;
  const parsedSubjectId = parseInt(subjectid);

  if (!videoname || !link || !subjectid) {
    throw new Error("Missing required fields");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/api/videos/create`,
      {
        subjectId: parsedSubjectId,
        link: link,
        videoname: videoname
      },
      { headers }
    );
    return { success: true, file: response.data };
  } catch (error) {
    const err = error as Error;
    console.error("Video upload error:", err);
    throw new Error(err.message || "Upload or creation failed");
  }
}

export async function createBranchAction(formData: FormData): Promise<{ success: true; data: any }> {
  const branchname = formData.get("branchname") as string;
  const branchcode = formData.get("branchcode") as string;
  const imageFile = formData.get("image") as File;

  if (!branchname || !branchcode || !imageFile) {
    throw new Error("Missing fields");
  }

  // Upload Image
  const extension = path.extname(imageFile.name);
  const cleanName = branchname.replace(/\s+/g, "-").toLowerCase();
  const key = `uploads/branches/${cleanName}-${Date.now()}${extension}`;
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const buffer = Buffer.from(await imageFile.arrayBuffer());

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: imageFile.type,
      })
    );

    const imageUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const headers = await getAuthHeaders();

    const response = await axios.post(`${API_URL}/api/branch/create`, {
      branchname,
      branchcode,
      displayimage: imageUrl
    }, { headers });

    return { success: true, data: response.data };

  } catch (error) {
    const err = error as Error;
    console.error("Branch creation error:", err);
    throw new Error(err.message || "Branch creation failed");
  }
}