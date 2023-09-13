// file-to-base64.util.ts
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject('Failed to read the file.');
      };
      reader.readAsDataURL(file);
    });
}
  