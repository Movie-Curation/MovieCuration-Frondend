// import NowPlaying from "../components/NowPlaying";
// import Populars from "../components/Populars";
import BoxOffice from '../components/BoxOffice';
import './Home.css';

function Home() {
    return (
        <div className="Home">
          <div className="main-content">
            {/* {<NowPlaying />}
            {<Populars />} */}
            <BoxOffice />
          </div>
        </div>
      );
}

export default Home;