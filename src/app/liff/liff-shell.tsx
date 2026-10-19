"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type LiffApi = {
  init(options: { liffId: string }): Promise<void>;
  isInClient(): boolean;
  isLoggedIn(): boolean;
  login(options?: { redirectUri?: string }): void;
  getIDToken(): string | null;
};

declare global {
  interface Window {
    liff?: LiffApi;
  }
}

type Screen = "loading" | "outside" | "waiting" | "eligible" | "error";

export default function LiffShell({ liffId }: { liffId: string }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [screen, setScreen] = useState<Screen>("loading");
  const [idToken, setIdToken] = useState<string | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [coachConsent, setCoachConsent] = useState(false);

  useEffect(() => {
    if (!sdkReady) return;
    if (!liffId) {
      setScreen("error");
      return;
    }

    let cancelled = false;
    async function initialize() {
      try {
        const liff = window.liff;
        if (!liff) throw new Error("LIFF SDK unavailable");
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          setScreen(liff.isInClient() ? "error" : "outside");
          return;
        }

        const token = liff.getIDToken();
        if (!token) throw new Error("LINE ID token unavailable");
        const response = await fetch("/api/liff/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
        if (!response.ok) throw new Error("LINE session rejected");
        const access = (await response.json()) as { access: "waiting" | "eligible" };
        if (cancelled) return;
        setIdToken(token);
        setScreen(access.access);
      } catch {
        if (!cancelled) setScreen("error");
      }
    }

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [liffId, sdkReady]);

  async function confirmRights() {
    if (!idToken) return;
    const response = await fetch("/api/liff/rights-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (response.ok) setRightsConfirmed(true);
  }

  async function confirmCoachConsent() {
    if (!idToken) return;
    const response = await fetch("/api/liff/ai-coach-consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (response.ok) setCoachConsent(true);
  }

  return (
    <main className="liff-app">
      <Script
        src="https://static.line-scdn.net/liff/edge/2/sdk.js"
        strategy="afterInteractive"
        onReady={() => setSdkReady(true)}
        onError={() => setScreen("error")}
      />
      <section className="liff-card" aria-live="polite">
        <p className="eyebrow">FOMOLOGY · LINE MINI APP</p>
        <h1>สร้างวิดีโอให้เริ่มง่าย</h1>

        {screen === "loading" && <p className="lead">กำลังยืนยันบัญชี LINE ของคุณ…</p>}
        {screen === "outside" && (
          <>
            <p className="lead">หน้านี้เปิดนอก LINE ได้ แต่ต้องลงชื่อเข้าใช้ด้วย LINE ก่อน</p>
            <button className="primary" onClick={() => window.liff?.login({ redirectUri: window.location.href })}>
              เข้าสู่ระบบด้วย LINE
            </button>
          </>
        )}
        {screen === "waiting" && (
          <p className="lead">ตอนนี้บัญชีของคุณยังไม่อยู่ในรายชื่อทดลองใช้ หากได้รับเชิญแล้ว โปรดติดต่อทีม FOMOlogy ผ่าน LINE OA</p>
        )}
        {screen === "error" && (
          <p className="lead">ยังเปิด LINE MINI App ไม่สำเร็จ โปรดลองเปิดจากลิงก์ใน LINE OA อีกครั้ง หรือติดต่อทีม FOMOlogy</p>
        )}
        {screen === "eligible" && (
          <>
            <nav className="liff-nav" aria-label="เมนูหลัก">
              <button type="button">สำรวจ</button>
              <button type="button">โค้ช</button>
              <button type="button">ผลงานของฉัน</button>
              <button type="button">ฉัน</button>
            </nav>
            <div className="liff-welcome">
              <h2>เริ่มสร้างครั้งแรก</h2>
              <p>คุณมีสิทธิ์ทดลองสร้างวิดีโอแบบประหยัด 1 ครั้ง</p>
              <p className="hint">AI Coach จะส่งเฉพาะ brief ที่คุณให้ไปยังผู้ให้บริการ AI ภายนอกเพื่อช่วยวางแผนวิดีโอ ผู้ให้บริการอาจเก็บ prompt และผลลัพธ์ตามเงื่อนไขของตนเอง</p>
              <button className="secondary" type="button" onClick={confirmCoachConsent} disabled={coachConsent}>
                {coachConsent ? "ยอมรับการใช้ AI Coach แล้ว" : "ฉันยอมรับการใช้ AI Coach"}
              </button>
              <p className="hint">ก่อนสร้าง โปรดยืนยันว่าคุณมีสิทธิ์และความยินยอมสำหรับรูปภาพ บุคคล เสียง และสื่อที่อัปโหลด</p>
              <button className="primary" type="button" onClick={confirmRights} disabled={rightsConfirmed}>
                {rightsConfirmed ? "บันทึกการยืนยันแล้ว" : "ฉันยืนยันสิทธิ์ในสื่อที่ใช้"}
              </button>
              {rightsConfirmed && <p className="hint">เมื่ออัปโหลดสื่อในครั้งถัดไป เราจะเตือนคุณอีกครั้งแบบสั้น ๆ</p>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
