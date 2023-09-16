const AWS = require('aws-sdk');
const sharp = require('sharp');

// AWS.config.update로 인증절차 필요 X
// lambda는 AWS 자체에서 돌려주기 때문

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; // ksbird
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/213123name.png
  console.log(Bucket, Key);
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[key.split('.').length - 1].toLowerCase();
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext; // jpg는 jpeg로 바꿔야함

  try {
    const s3Object = await s3.getObject({ Bucket, key }).promise(); // 이미지 가져오기
    console.log('original', s3Object.Body.length); // 이미지 바이트 확인
    const resizedImage = await sharp(s3Object.Body) // 이미지 리사이징
    .resize(400, 400, {fit: 'inside'})
    .toFormat(requiredFormat)
    .toBuffer();
    await s3.putObject({ // 리사이징된 이미지를 업로드
      Bucket, 
      key: `thumb/${filename}`,
      Body: resizedImage,
    }).promise();
    console.log('put', resizeImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error);
    return callback(error); // 람다 종료
  }
}