const admin = require('firebase-admin');
const serviceAccount = require('../json/lap-trinh-tich-hop-nang-45d37-firebase-adminsdk-vv4md-564f2d6cfb.json');

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lap-trinh-tich-hop-nang-45d37-default-rtdb.firebaseio.com/' 
});

// Export Firebase Realtime Database để sử dụng ở nơi khác
const fb = admin.database();
module.exports = fb;
