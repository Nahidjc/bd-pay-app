import { Image as ImageCompressor } from "react-native-compressor";
import * as FileSystem from "expo-file-system";

const getFileSize = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.size;
  } catch (error) {
    console.log("Error getting file size:", error);
    return 0;
  }
};

export const compressImage = async (uri) => {
  try {
    const originalSize = await getFileSize(uri);
    let quality = 0.7;
    let compressedUri = uri;
    let currentSize = originalSize;
    let attempts = 0;
    const maxAttempts = 3;
    const targetSizeReduction = 0.4;

    while (
      currentSize > originalSize * targetSizeReduction &&
      attempts < maxAttempts
    ) {
      compressedUri = await ImageCompressor.compress(uri, {
        quality,
        maxWidth: 1200,
        maxHeight: 1200,
        input: "uri",
        output: "jpg",
        returnableOutputType: "uri",
      });

      currentSize = await getFileSize(compressedUri);

      if (currentSize > originalSize * targetSizeReduction) {
        quality -= 0.2;
      }

      attempts++;
    }

    // console.log("Compression results:");
    // console.log("Original size:", originalSize);
    // console.log("Compressed size:", currentSize);
    // console.log(
    //   "Compression ratio:",
    //   (((originalSize - currentSize) / originalSize) * 100).toFixed(2) + "%"
    // );

    return compressedUri;
  } catch (error) {
    // console.log("Compression error:", error);
    throw error;
  }
};
