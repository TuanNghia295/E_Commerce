import Hero from "../hero/Hero";
import NewCollections from "../newCollections/NewCollections";
import NewsLetters from "../newLetters/NewLetters";
import Offers from "../offer/Offers";
import Popular from "../popular/Popular";

function Home() {
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
