import Image from "next/image";

export interface UploadedImage {
  url: string; // 이미지 미리보기 URL
  name: string; // 파일 이름
  size: number; // 파일 크기 (bytes)
}

export function ListImage({ image }: { image: UploadedImage }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={image.url}
        alt={image.name}
        quality={10}
        className="w-[36px] h-[36px]"
        width={36}
        height={36}
      />
      <p className="text-sm font-medium">{image.name}</p>
      <p className="text-xs text-gray-500">
        {Math.round(image.size / 1024)} KB
      </p>
    </div>
  );
}
