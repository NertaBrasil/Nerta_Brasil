"use client";

import { useId, useState, type ChangeEvent } from "react";

const INVALID_FILE_ERROR = "Selecione um arquivo de imagem válido.";

type ImageUploaderProps = {
  onFileSelected: (file: File, previewUrl: string) => void;
};

export function ImageUploader({ onFileSelected }: ImageUploaderProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(INVALID_FILE_ERROR);
      return;
    }

    setError(null);
    onFileSelected(file, URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-col gap-[7px]">
      <label
        htmlFor={inputId}
        className="flex h-11 w-fit cursor-pointer items-center rounded-md border border-navy-border bg-navy-deeper px-[14px] font-body text-sm font-medium text-white transition-colors duration-fast hover:border-nerta-blue"
      >
        Adicionar imagem
      </label>
      <input
        id={inputId}
        type="file"
        className="sr-only"
        onChange={handleChange}
      />
      {error && <span className="font-body text-xs text-[#E5634D]">{error}</span>}
    </div>
  );
}
