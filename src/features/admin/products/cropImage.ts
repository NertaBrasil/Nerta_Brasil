function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    image.src = url;
  });
}

/** Recorta a imagem para o maior quadrado central (1:1) e retorna um PNG. */
export async function cropImageToSquareBlob(imageUrl: string, size = 600): Promise<Blob> {
  const image = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context não disponível.");

  const minSide = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - minSide) / 2;
  const sy = (image.naturalHeight - minSide) / 2;
  ctx.drawImage(image, sx, sy, minSide, minSide, 0, 0, size, size);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Falha ao gerar a imagem recortada."));
    }, "image/png");
  });
}
