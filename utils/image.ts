import { UploadedImage } from "@/app/convert-image/components/image-list";

export type ImageExtension = "jpeg" | "png" | "webp";

export const imageExtensions: ImageExtension[] = ["jpeg", "png", "webp"];

export async function convertImageFilesToFormat(
  files: File[],
  extension: ImageExtension
): Promise<UploadedImage[]> {
  const convertedImages: { name: string; size: number; url: string }[] = [];
  const format = `image/${extension}`;

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      console.warn(`${file.name} is not an image file.`);
      continue;
    }

    const imageURL = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          ctx.drawImage(img, 0, 0);

          const convertedURL = canvas.toDataURL(format);
          resolve(convertedURL);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Estimate new size (approximation)
    const base64Length = imageURL.length - `data:${format};base64,`.length;
    const newSize = Math.ceil(base64Length * 0.75); // Base64 to byte conversion

    convertedImages.push({
      name: file.name.replace(/\.[^.]+$/, `.${format.split("/")[1]}`), // Update file extension
      size: newSize,
      url: imageURL,
    });
  }

  return convertedImages;
}
