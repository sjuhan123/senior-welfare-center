import FeatureFilterBar from './components/FeatureFilterBar';
import WelfareCards from './components/WelfareCards';
import BodyLayout from '../../components/layout/BodyLayout';
import { Suspense, useState } from 'react';
import { CURRENT_VIEW } from './constant';
import type { DistrictData } from '../../types/district';
import type { Location } from '../../types/location';
import WelfareCardsSkeleton from '../../components/card/WelfareCardsSkeleton';
import DistrictFilterBar from './components/DistrictsFilterBar';
import SearchNoticeBar from './components/SearchNoticeBar';

const WelfareList = () => {
  const [currentFilterView, setCurrentFilterView] = useState<
    (typeof CURRENT_VIEW)[keyof typeof CURRENT_VIEW]
  >(CURRENT_VIEW.LOCATION);
  const [isSearching, setIsSearching] = useState(false);

  // TODO: Default 전체구로 변경
  const [district, setDistrict] = useState<DistrictData | null>({
    _id: '656059edabd43396885a4656',
    name: '종로구',
  });

  const [location, setLocation] = useState<Location | null>(null);

  // TODO: City API 완성시 로직 거현
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCitySet = (_city: string) => {
    setCurrentFilterView(CURRENT_VIEW.LOCATION);
    setLocation(null);
  };

  const onAddressSet = (location: Location) => {
    setCurrentFilterView(CURRENT_VIEW.ADDRESS);
    setLocation(location);
    setIsSearching(true);
  };

  const onAddressNearBySet = (location: Location) => {
    setCurrentFilterView(CURRENT_VIEW.NEARBY);
    setLocation(location);
    setIsSearching(true);
  };

  const handleDistrictIdChange = (district: DistrictData) => {
    setCurrentFilterView(CURRENT_VIEW.LOCATION);
    setDistrict(district);
    setLocation(null);
  };

  return (
    <BodyLayout>
      <FeatureFilterBar
        currentFilter={currentFilterView}
        onCitySet={onCitySet}
        onAddressSet={onAddressSet}
        onAddressNearBySet={onAddressNearBySet}
      />
      {currentFilterView === CURRENT_VIEW.LOCATION && district && (
        <DistrictFilterBar
          currentDistrict={district.name}
          onDistrictClick={handleDistrictIdChange}
        />
      )}
      {currentFilterView !== CURRENT_VIEW.LOCATION && location && (
        <SearchNoticeBar isSearching={isSearching} searchLocation={location} />
      )}
      {district && (
        <Suspense fallback={<WelfareCardsSkeleton />}>
          <WelfareCards
            onCardSet={() => setIsSearching(false)}
            location={location}
            districtId={district?._id}
          />
        </Suspense>
      )}
    </BodyLayout>
  );
};

export default WelfareList;
