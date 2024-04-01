import { useEffect, useState } from "react";
import Hero from "../hero/Hero";
import NewCollections from "../newCollections/NewCollections";
import NewsLetters from "../newLetters/NewLetters";
import Offers from "../offer/Offers";
import Popular from "../popular/Popular";

function Home() {
  const [userData,setUserData] = useState("")
  useEffect(() => {
    // Hàm fetchUser sẽ gửi yêu cầu đến endpoint /user trên server để lấy thông tin người dùng
    const fetchUser = async () => {
      try {
        await fetch("http://localhost:2905/user")
          .then((reponse) => reponse.json())
          .then((data) => setUserData(data));
          console.log(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser(); // Gọi hàm fetchUser để lấy thông tin người dùng khi component được render
  }, []);
  return (
    <div>
      <Hero />
      <Popular/>
      <Offers/>
      <NewCollections/>
      <NewsLetters/>
    </div>
  );
}

export default Home;
