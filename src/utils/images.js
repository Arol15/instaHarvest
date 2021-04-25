export const createFormData = (images) => {
  const imagesData = new FormData();
  images.forEach((image) => {
    imagesData.append("file", image);
  });
  return imagesData;
};
