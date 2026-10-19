import LiffShell from "./liff-shell";

export default function LiffPage() {
  return <LiffShell liffId={process.env.NEXT_PUBLIC_LIFF_ID ?? ""} />;
}
