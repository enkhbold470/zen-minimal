import { NextResponse } from "next/server";
import { googleForm } from "@/config/site";
export async function POST(req: Request) {
  const { username, laptopChoice, phoneNumber, email } = await req.json();
//   console.log(username, laptopChoice, phoneNumber, email)
  // Replace `entry.XXXXX` with actual Google Form input field entry IDs
  const formData = new URLSearchParams();
  formData.append(`${googleForm.fields.name}`, username);
  formData.append(`${googleForm.fields.laptopChoice}`, laptopChoice);
  formData.append(`${googleForm.fields.phone}`, phoneNumber);
  formData.append(`${googleForm.fields.email}`, email);
//   console.log(formData)
//   console.log(googleForm.url)


  const response = await fetch(googleForm.url, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
//   
  if (response.ok) {
    return NextResponse.json({ message: "Success" });
  } else {
    return NextResponse.error();
  }
}
