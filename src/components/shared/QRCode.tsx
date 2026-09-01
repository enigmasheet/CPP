"use client";

import QRCodeLib from "qrcode";
import { useEffect, useState } from "react";

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 200 }: QRCodeProps) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCodeLib.toDataURL(url, { width: size }, (err: Error | null | undefined, dataUrl: string) => {
      if (!err) setSrc(dataUrl);
    });
  }, [url, size]);

  if (!src) return null;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="QR Code" width={size} height={size} className="rounded-lg" />;
}
