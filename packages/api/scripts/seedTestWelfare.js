// 개발용 테스트 복지관 + 관리자 Membership을 만들어두는 스크립트. 실제 서비스 데이터가 아님.
// 사용법: node scripts/seedTestWelfare.js <카카오userId> [role=admin]
import { mongoConnect, mongoDisconnect } from '../src/server/mongo.js';
import District from '../src/models/districts.mongo.js';
import Welfare from '../src/models/welfares.mongo.js';
import Membership from '../src/models/membership.mongo.js';

const TEST_DISTRICT_NAME = '테스트';
const TEST_WELFARE_NAME = '태강복지관';

async function seedTestWelfare(userId, role) {
  await mongoConnect();

  const district = await District.findOneAndUpdate({ name: TEST_DISTRICT_NAME }, { name: TEST_DISTRICT_NAME }, { upsert: true, new: true });

  const welfare = await Welfare.findOneAndUpdate(
    { name: TEST_WELFARE_NAME },
    {
      district: district._id,
      name: TEST_WELFARE_NAME,
      address: '테스트용 가상 주소',
      phone: '02-0000-0000',
      homepage: '',
      latitude: 37.5,
      longitude: 127.0,
      remarks: '개발 테스트용 가상 복지관',
    },
    { upsert: true, new: true },
  );

  const membership = await Membership.findOneAndUpdate(
    { userId, welfare: welfare._id },
    { userId, welfare: welfare._id, role, status: 'approved', joinedVia: 'manual' },
    { upsert: true, new: true },
  );

  console.log('welfareId:', welfare._id.toString());
  console.log('membershipId:', membership._id.toString());
  console.log('role:', membership.role);

  await mongoDisconnect();
}

const [, , userId, role = 'admin'] = process.argv;

if (!userId) {
  console.error('사용법: node scripts/seedTestWelfare.js <카카오userId> [role=admin]');
  process.exit(1);
}

seedTestWelfare(userId, role).catch(error => {
  console.error('시드 실패', error);
  process.exit(1);
});
