import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import { useEffect, useState } from "react";
import StarRating from "./Star";

const KEY = "d855abd9";
const film = "Interstellar"
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLodaing , setLoading] = useState(false);
  const  [iserror, seterror] = useState("")
  const [query, setQuery] = useState("");
  const [selectedID, SetselectedID] = useState("");
 
  const HandleSelectedID = (selectedID) => {
     SetselectedID(selectedID)
  };

  const Close_btn = () => {
      SetselectedID("");
  };

  const add_moive_to_List = (watched) => {
      setWatched((pre)=> [...pre, watched]);
  };
  
  const handle_delete = (movieID) => {
   setWatched( watched.filter((movie)=> {return (movie.imdbID!=movieID)}))
  };
  
 
  useEffect(function () {
    async function moivefunctoion() {
      try{
        setLoading(true);
        seterror("");
        const response = await fetch(`http://www.omdbapi.com/?apikey=d855abd9&s=${query}`)
        if(!response.ok) throw new Error("Something  wrong");
        const  data = await response.json();
       
        if(data.Response === 'False') throw new Error("Something  wrong");
        setMovies(data.Search);
       
       
      }
      catch(err){
            console.error(err.message)
            seterror(err.message)
            setMovies([]);
      }
      finally{
        setLoading(false);
        
      }
    }
    if(query.length<3)
      {
        seterror("")
        setMovies([]);
        return;
      }
    moivefunctoion();
  }, [query]);

  return (
    <>
      <Nav_bar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult movie={movies} />
      </Nav_bar>
      <Main>
        <ListBox>
          {isLodaing && <Loader />}
          {!isLodaing && !iserror && <MoivesList movies={movies} HandleSelectedID={HandleSelectedID}/>}
          {iserror && <Error_message message={iserror} />}
        </ListBox>
        
        <WatchedBox>
          {selectedID ? 
            <Moive_details selectedID={selectedID} Close_btn={Close_btn} add_moive_to_List={add_moive_to_List} watched={watched}/>
          : 
            <>
              <Moive_Summary watched={watched} />
              <WatchedMoiveList watched={watched} handle_delete={handle_delete} />
            </>
          }
        </WatchedBox>
        
      </Main>
    </>
  );
}

const Loader = () => {
    return (
      <div className="loader"><p>Loading</p></div>
    )
};

const Error_message = ({message}) => {
    return (
      <p className="error"> <span>{message}</span></p>
    )
};
const Nav_bar = ({children}) => {
  return (
    <nav className="nav-bar">
      <Logo />
      
      {children}
    </nav>
  );
};

const Search = ({query, setQuery}) => {
 
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const SearchResult = ({movie}) => {
  return (
    <p className="num-results">
      Found <strong>{movie.length}</strong> results
    </p>
  );
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const Main = ({children}) => {
  

  
  return <main className="main">
   {children}
  </main>;
};


const ListBox = ({children}) => {
  
  
  const [isOpen1, setIsOpen1] = useState(true);
  
 
  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen1((open) => !open)}
        >
          {isOpen1 ? "–" : "+"}
        </button>
        {isOpen1 && children}
      </div>

      
    </>
  );
};

const WatchedBox = ({children}) => {

  
  const [isOpen2, setIsOpen2] = useState(true);

  
  return(
    <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen2((open) => !open)}
        >
          {isOpen2 ? "–" : "+"}
        </button>
        {isOpen2 && (
          <>
            
           {children}
            
          </>
        )}
      </div>
  )
};



const Moive_details = ({selectedID,Close_btn,add_moive_to_List,watched}) => {

    const [movie , setMovie] = useState({});
    const [userRating, SetuserRating] = useState("");
    console.log(userRating)
    const {
      Title: title,
      Year: year,
      Poster: poster,
      Runtime: runtime,
      imdbRating,
      Plot: plot,
      Released: release,
      Actors: actors,
      Genre:genre,
      Director:director
    } = movie;
   
    const iswatched = watched.map((watchedMovie)=> watchedMovie.imdbID).includes(selectedID);

    const handleAdd = () => {
        const watchedMovie = {
           imdbID:selectedID,
           title,
           year,
           poster,
           imdbRating:Number(imdbRating),
           UserRating:userRating,
           runtime:Number(runtime.split(" ").at(0))
        }
        add_moive_to_List(watchedMovie);
    };
  useEffect(() => {
    async function getMoviesByID() {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${selectedID}&apikey=d855abd9`
      );
     
      const data = await response.json(); 
      setMovie(data);
    }
    getMoviesByID();
  }, [selectedID]);
  
  useEffect(
    function () {
      if (!movie.Title) return;
      else document.title = `Movie | ${movie.Title}`;

      return function(){ document.title = "UsePopCorn"}
    },
    [movie.Title]
  );
  const watchedUserRating = watched.find((movie)=>movie.imdbID===selectedID)?.UserRating

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={Close_btn}>
          &larr;
        </button>
        <img src={poster}></img>
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {release} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>⭐ {imdbRating}</p>
        </div>
      </header>
      <section>
      <div className="rating">
        {!iswatched ? (
          <>
            
             
              <StarRating
                maxRating={10}
                size={32}
                onSetRating={SetuserRating}
              />
            
            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
               
                + Add to List
              </button>
            )}{" "}
          </>
        ):<p> You Already Rated this Moive as {watchedUserRating} <span>⭐</span> </p>}
         </div>
        <p>
          <em>{plot}</em>
        </p>
        <p> Starring {actors}</p>
        <p>Directed By {director}</p>
      </section>
    </div>
  );
};

const MoivesList = ({movies,HandleSelectedID,add_moive_to_List}) => {
  
   return (
    <ul className="list list-movies">
            {movies?.map((movie) => (
              <Movies movie = {movie} HandleSelectedID={HandleSelectedID}/>
              
            ))}
          </ul>
   )
};

const Movies = ({movie,HandleSelectedID}) => {
  return (
    <li onClick={()=>HandleSelectedID(movie.imdbID)} key={movie.imdbID} >
                <img src={movie.Poster} alt={`${movie.Title} poster`} />
                <h3>{movie.Title}</h3>
                <div>
                  <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                  </p>
                </div>
              </li>
  )
};


const Moive_Summary = ({watched}) => {

  const avgImdbRating = average(watched.map((movie) => Number(movie.imdbRating)));
  const avgUserRating = average(watched.map((movie) => movie.UserRating));
  const avgRuntime = average(watched.map((movie) => (movie.runtime)));
  return (
    <div className="summary">
              <h2>Movies you watched</h2>
              <div>
                <p>
                  <span>#️⃣</span>
                  <span>{watched.length} movies</span>
                </p>
                <p>
                  <span>⭐️</span>
                  <span>{avgImdbRating}</span>
                </p>
                <p>
                  <span>🌟</span>
                  <span>{avgUserRating}</span>
                </p>
                <p>
                  <span>⏳</span>
                  <span>{avgRuntime} min</span>
                </p>
              </div>
            </div>
  )
};

const WatchedMoiveList = ({watched,handle_delete}) => {
  return(
    <ul className="list">
              {watched.map((movie) => (
                <li key={movie.imdbID}>
                  <img src={movie.poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>⭐️</span>
                      <span>{Number(movie.imdbRating)}</span>
                    </p>
                    <p>
                      <span>🌟</span>
                      <span>{movie.UserRating}</span>
                    </p>
                    <p>
                      <span>⏳</span>
                      <span>{movie.runtime} min</span>
                    </p>
                    <button className="btn-delete" onClick={()=>handle_delete(movie.imdbID)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>

  )
};



