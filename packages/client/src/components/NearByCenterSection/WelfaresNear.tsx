import useGetWelfaresLocation from "../../hooks/api/welfare/useGetWelfaresByLocation";
import WelfareCards from "../common/Card/WelfareCards";

type ClosestCenterListProps = {
  location: {
    latitude: number;
    longitude: number;
  };
  from?: string;
};

const WelfaresNear = ({ location, from = "me" }: ClosestCenterListProps) => {
  const { data: welfares } = useGetWelfaresLocation(location, {
    suspense: true,
  });

  return (
    <>{welfares && <WelfareCards welfares={welfares.data} from={from} />}</>
  );
};

export default WelfaresNear;
