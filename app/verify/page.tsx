"use server";

import { Suspense } from "react";
import VerifyForm from "@/components/Verify-Form";

export default  async function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}