import JSZip from "jszip";
import type { ConvertedAsset, ConversionFile } from "@/types/conversion";

export async function createZipFromConvertedFiles(files: ConversionFile[], assets: ConvertedAsset[] = []): Promise<Blob> {
  const zip = new JSZip();
  files
    .filter((file): file is ConversionFile & { converted: NonNullable<ConversionFile["converted"]> } =>
      Boolean(file.converted),
    )
    .forEach((file) => {
      zip.file(file.converted.fileName, file.converted.blob);
    });
  assets.forEach((asset) => {
    zip.file(asset.fileName, asset.blob);
  });

  return zip.generateAsync({ type: "blob" });
}
