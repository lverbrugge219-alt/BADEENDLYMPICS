import React, { useRef, useState } from 'react';
import { PresetAvatarId } from '../types';
import { PRESET_AVATARS } from '../data/juryAvatars';
import { JuryAvatar } from './JuryAvatar';
import { compressImageFile, CompressionResult } from '../utils/imageCompressor';
import { Award, Upload, ImageIcon, Sparkles, X, Check } from 'lucide-react';

interface AvatarSelectorProps {
  avatarType: 'preset' | 'custom';
  setAvatarType: (type: 'preset' | 'custom') => void;
  avatarPresetId: PresetAvatarId;
  setAvatarPresetId: (id: PresetAvatarId) => void;
  photoUrl: string | null;
  setPhotoUrl: (url: string | null) => void;
  title?: string;
  subtitle?: string;
  presetTabLabel?: string;
  customTabLabel?: string;
  onError?: (msg: string | null) => void;
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatarType,
  setAvatarType,
  avatarPresetId,
  setAvatarPresetId,
  photoUrl,
  setPhotoUrl,
  title = 'KIES JULLIE AVATAR OF TEAMFOTO',
  subtitle = 'Kies een officiële badeend mascotte of upload een eigen teamfoto.',
  presetTabLabel = 'BADEEND MASCOTTES (10)',
  customTabLabel = 'EIGEN FOTO UPLOADEN',
  onError,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError?.('Selecteer a.u.b. een geldig afbeeldingsbestand (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsCompressing(true);
      onError?.(null);
      const result = await compressImageFile(file, 360, 0.82);
      setCompressionInfo(result);
      setPhotoUrl(result.dataUrl);
      setAvatarType('custom');
    } catch (err: any) {
      onError?.(err?.message || 'Fout bij het comprimeren van de foto.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    setCompressionInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-2 gap-1">
        <div>
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>{title}</span>
          </h4>
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {avatarType === 'custom' && photoUrl ? 'Eigen teamfoto actief' : 'Badeend geselecteerd'}
        </span>
      </div>

      {/* Mode selector Tabs */}
      <div className="grid grid-cols-2 border-2 border-black bg-slate-100">
        <button
          type="button"
          onClick={() => setAvatarType('preset')}
          className={`py-2.5 px-3 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            avatarType === 'preset'
              ? 'bg-amber-400 text-black shadow-inner'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Award size={14} />
          <span>{presetTabLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => setAvatarType('custom')}
          className={`py-2.5 px-3 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors border-l-2 border-black ${
            avatarType === 'custom'
              ? 'bg-amber-400 text-black shadow-inner'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Upload size={14} />
          <span>{customTabLabel}</span>
        </button>
      </div>

      {/* 1. Presets Grid */}
      {avatarType === 'preset' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-slate-50 border-2 border-black">
            {PRESET_AVATARS.map((preset) => {
              const isSelected = avatarPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAvatarPresetId(preset.id)}
                  className={`p-2 border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 relative ${
                    isSelected
                      ? 'border-black bg-amber-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ring-2 ring-amber-400'
                      : 'border-slate-300 bg-white hover:border-black'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-black text-amber-400 flex items-center justify-center rounded-full">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                  <JuryAvatar
                    avatarType="preset"
                    avatarPresetId={preset.id}
                    size="md"
                  />
                  <div className="min-w-0 w-full">
                    <span className="font-display font-black text-[10px] uppercase text-black block truncate leading-tight">
                      {preset.name}
                    </span>
                    <span className="text-[8px] font-bold text-slate-600 block truncate leading-none mt-0.5">
                      {preset.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Custom Upload */}
      {avatarType === 'custom' && (
        <div className="p-4 bg-slate-50 border-2 border-black space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Preview Container */}
            <div className="shrink-0">
              {photoUrl ? (
                <div className="relative">
                  <JuryAvatar
                    avatarType="custom"
                    photoUrl={photoUrl}
                    size="lg"
                    showBadge
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-6 h-6 text-xs font-black flex items-center justify-center border-2 border-black hover:bg-rose-700 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    title="Verwijder foto"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon size={28} />
                  <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">GEEN FOTO</span>
                </div>
              )}
            </div>

            {/* Upload Button & Information */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                disabled={isCompressing}
                onClick={() => fileInputRef.current?.click()}
                className="bg-black text-amber-400 px-4 py-2.5 text-xs font-display font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Upload size={14} />
                <span>{photoUrl ? 'ANDERE FOTO KIEZEN' : 'KIES TEAMFOTO'}</span>
              </button>

              <div className="text-[10px] text-slate-600 font-medium space-y-1">
                <p>Ondersteunt JPG, PNG en WebP. Wordt automatisch vierkant bijgesneden.</p>
                {compressionInfo && (
                  <p className="font-bold text-emerald-700">
                    ✓ Geoptimaliseerd: {compressionInfo.compressedSizeKb} KB ({compressionInfo.width}×{compressionInfo.height}px, {compressionInfo.format.toUpperCase()})
                  </p>
                )}
                {isCompressing && (
                  <p className="font-bold text-amber-600 animate-pulse">
                    Afbeelding optimaliseren en bijsnijden...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
