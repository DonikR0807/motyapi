import { fileTypeFromBuffer } from 'file-type';
import InvalidDataError from './errorClasses/InvalidDataError.js';

const checkImage = async (buffer) => {
  const fileInfo = await fileTypeFromBuffer(buffer);

  if (!fileInfo || !(fileInfo.mime.startsWith('image/'))) {
    throw new InvalidDataError('Некорректный формат файла');
  }
};

export default checkImage;
