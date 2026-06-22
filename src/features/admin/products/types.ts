export type ReorderImagesInput = {
  product_id: string;
  /** IDs de imagem na nova ordem (index 0 = position 1) */
  image_ids: string[];
};
