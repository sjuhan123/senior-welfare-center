import { useQuery } from "react-query";
import { WelfareData } from "../types/welfare";
import { useNavigate } from "react-router-dom";

const getAllWelfares = async () => {
  const response = await fetch("http://localhost:8000/welfares");
  const data = await response.json();
  return data;
};

const Main = () => {
  const navigate = useNavigate();
  const { data } = useQuery("welfares", () => getAllWelfares());

  return (
    <div>
      <h1>메인 페이지</h1>
      <button onClick={() => navigate("list")}>복지관 목록 보기</button>
      <ul>
        {data?.data.map((welfareInfo: WelfareData) => (
          <li key={welfareInfo.id}>{welfareInfo.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
