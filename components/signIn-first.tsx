import { Button } from "./ui/button";
import Link from "next/link";

export default function SignInFirst() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Signin first to continue !</h1>
      <Button>
        <Link href="/login">Signin</Link>
      </Button>
    </div>
  );
}
