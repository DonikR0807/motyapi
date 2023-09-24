import EasyYandexS3 from 'easy-yandex-s3';

const { S3_KEY_ID, S3_SECRET_KEY } = process.env;

const { default: Default } = EasyYandexS3;

const s3 = new Default({
  auth: {
    accessKeyId: S3_KEY_ID,
    secretAccessKey: S3_SECRET_KEY,
  },
  Bucket: 'motyanime',
  debug: true,
});

export default s3;
