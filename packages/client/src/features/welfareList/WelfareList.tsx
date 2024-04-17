import FeatureFilterBar from './components/FeatureFilterBar';
import WelfareCards from './components/WelfareCards';
import BodyLayout from '../../components/layout/BodyLayout';
import { Suspense, useState } from 'react';
import { CURRENT_VIEW } from './constant';
import type { DistrictData } from '../../types/district';
import type { Location } from '../../types/location';
import WelfareCardsSkeleton from '../../components/card/WelfareCardsSkeleton';
import DistrictFilterBar from './components/DistrictsFilterBar';

const WelfareList = () => {
  const [currentView] = useState(CURRENT_VIEW.LOCATION);
  // TODO: Default 전체구로 변경
  const [district, setDistrict] = useState<DistrictData | null>({
    _id: '656059edabd43396885a4656',
    name: '종로구',
  });

  // TODO: 집근처, 혹은 주소지 근처 복지관 찾기 로직 구현시 사용 예정
  const [location] = useState<Location | null>(null);

  const handleDistrictIdChange = (district: DistrictData) => {
    setDistrict(district);
  };

  return (
    <BodyLayout>
      <FeatureFilterBar />
      {currentView === CURRENT_VIEW.LOCATION && district && (
        <DistrictFilterBar
          currentDistrict={district.name}
          onDistrictClick={handleDistrictIdChange}
        />
      )}
      {district && (
        <Suspense fallback={<WelfareCardsSkeleton />}>
          <WelfareCards location={location} districtId={district?._id} />
        </Suspense>
      )}
    </BodyLayout>
  );
};

export default WelfareList;
