export const svgToDataURL = (svgXml: string): string => {
  console.log("svgXml", svgXml);
  return `data:image/svg+xml;base64,${btoa(svgXml)}`;
};

// 이미지를 Base64 Data URL로 변환하는 함수
export const pngToDataURL = (
  imagePath: string,
  callback: (dataURL: string) => void
) => {
  const img = new Image();

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx?.drawImage(img, 0, 0);

    const base64String = canvas.toDataURL("image/png");
    callback(base64String);
  };

  img.onerror = function () {
    console.error("Error loading image: " + imagePath);
  };

  img.src = imagePath;
};
