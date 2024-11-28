import NowPlaying from "../components/NowPlaying";
import Populars from "../components/Populars";
import './Home.css';

function Home() {
    return (
        <div className="Home">
          <div className="main-content">
            {<NowPlaying />}
            {<Populars />}
          </div>
        </div>
      );
}

export default Home;