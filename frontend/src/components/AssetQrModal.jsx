import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * Modern Asset QR access modal — real scannable QR via qrcode.react
 */
const AssetQrModal = ({ asset, onClose }) => {
  const publicUrl = useMemo(() => {
    if (!asset) return '';
    const assetId = asset.id || asset.code || asset._id;
    return `https://assetcare.demo/public/asset/${assetId}`;
  }, [asset]);

  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#062d3d]/55 backdrop-blur-[2px]"
        aria-label="Close QR modal"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Asset QR access
        </p>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{asset.name}</h3>
        <p className="mt-0.5 font-mono text-xs text-slate-500">{asset.code}</p>

        <div className="mx-auto mt-8 flex h-56 w-56 items-center justify-center rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <QRCodeSVG
            value={publicUrl}
            size={200}
            level="H"
            bgColor="#ffffff"
            fgColor="#062d3d"
            marginSize={1}
            title={`QR code for ${asset.code}`}
          />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Scan to open the public asset page
        </p>
        <p className="mt-2 break-all text-center font-mono text-[10px] leading-relaxed text-slate-400">
          {publicUrl}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#062d3d] py-3 text-[15px] font-semibold text-white transition hover:bg-[#0a3a4d]"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AssetQrModal;
