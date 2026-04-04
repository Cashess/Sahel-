import https from "https"; // ← ADD THIS
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, amount } = await request.json();

    const params = JSON.stringify({ email, amount, callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-payment` });

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      
    };

    const paystackResponse = await new Promise<any>((resolve, reject) => {
      const req = https.request(options, (res: any) => {
        let data = "";

        res.on("data", (chunk : string) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      });

      req.on("error", (err : any) => reject(err));
      req.write(params);
      req.end();
    });

    // Check if Paystack returned an error
    if (!paystackResponse.status || !paystackResponse.data?.authorization_url) {
      console.error("Paystack error:", paystackResponse);
      return NextResponse.json(
        { error: paystackResponse.message || "Payment initialization failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { authorization_url: paystackResponse.data.authorization_url },
      message: "Payment initialized",
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}