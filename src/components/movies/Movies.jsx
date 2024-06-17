import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Skeleton, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { LeftOutlined, RightOutlined, HomeOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { getMoviesByMood, getMovieVideos } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Movies = () => {
  const { mood } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(5); // pageCount burada azaltıldı

  useEffect(() => {
    fetchRecommendedMovies();
  }, [mood, currentPage]);

  const fetchRecommendedMovies = async () => {
    try {
      setIsLoading(true); // Yükleme durumunu başlat
      const fetchedMovies = await getMoviesByMood(mood, currentPage);
      const filteredMovies = fetchedMovies.filter(movie => movie.vote_average > 5 && movie.overview);
      if (!filteredMovies.length) {
        console.error('Filtreleme sonucu boş!');
        setMovies([]);
      } else {
        const moviesWithVideos = await Promise.all(filteredMovies.map(async movie => {
          const videoKey = await getMovieVideos(movie.id).catch(error => {
            console.error('Error fetching movie videos:', error);
            return null;
          });
          return { ...movie, videoKey };
        }));
        setMovies(moviesWithVideos);
        setCurrentMovieIndex(Math.floor(Math.random() * moviesWithVideos.length));
      }
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    } finally {
      setIsLoading(false); // Yükleme durumunu sonlandır
    }
  };

  const handlePreviousMovieClick = () => {
    setCurrentMovieIndex(prevIndex => (prevIndex - 1 + movies.length) % movies.length);
  };

  const handleNextMovieClick = () => {
    setCurrentMovieIndex(prevIndex => (prevIndex + 1) % movies.length);
  };

  const handleGoBackButton = () => {
    setCurrentPage(1);
    navigate('/');
  };

  const handleReloadButtonClick = () => {
    fetchRecommendedMovies();
  };

  const handleTitleClick = (title) => {
    navigator.clipboard.writeText(title);
    toast.success(`${title} film başlığı başarıyla kopyalandı!`, { position: "top-right", autoClose: 2000 });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
      <h3 className="text-white mt-1" style={{ textDecoration: 'underline' }}>"İşte senin için önerilen muhteşem filmler..."</h3>
      <div className="container mx-auto text-center flex-grow max-w-screen-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <Skeleton active paragraph={{ rows: 3 }} />
            <span className="text-white mt-4">Senin için en iyi filmleri getiriyoruz...</span>
            <LoadingOutlined style={{ fontSize: 48, color: 'red', marginTop: '1rem' }} spin />
          </div>
        ) : (
          <>
            {movies.length > 0 ? (
              <div className="flex flex-col mt- items-center">
                <div className="rounded-lg shadow-xl p-4 mt-4 w-full max-w-screen-sm bg-gray-950" >
                  <div className="flex flex-col items-start text-white">
                    <div className="w-full">
                      {(movies[currentMovieIndex].videoKey && movies[currentMovieIndex].videoKey !== null) ? (
                        <iframe
                          width="100%"
                          height="400"
                          src={`https://www.youtube.com/embed/${movies[currentMovieIndex].videoKey}`}
                          title="Movie Trailer"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={`https://image.tmdb.org/t/p/w500/${movies[currentMovieIndex].poster_path}`}
                          alt="Movie Poster"
                          className="mx-auto" 
                          style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
                        />
                      )}
                    </div>
                    <div className="flex flex-row justify-between mt-4 w-full">
                      <div className="flex flex-col items-start">
                        <Tooltip title="Başlığı Kopyala">
                          <h2 className="text-lg font-bold cursor-pointer" onClick={() => handleTitleClick(movies[currentMovieIndex].title)}>{movies[currentMovieIndex].title}</h2>
                        </Tooltip>
                        <p className="text-sm text-gray-300">Vizyon Tarihi: {formatDate(movies[currentMovieIndex].release_date)}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p><span role="img" aria-label="Star">⭐</span>{parseFloat(movies[currentMovieIndex].vote_average).toFixed(1)}/10</p>
                      </div>
                    </div>
                    <div className="text-left mt-3">
                      <Card.Meta
                        description={(movies[currentMovieIndex].overview)}
                      />
                    </div>
                    <div className="flex flex-wrap mt-2">
                      {movies[currentMovieIndex].genres && movies[currentMovieIndex].genres.map((genre, index) => (
                        <Tag key={index} className="mr-2 mb-2">{genre.name}</Tag>
                      ))}
                    </div>
                    <div className="flex flex-row justify-between mt-4 w-full">
                      <Button type="primary" danger onClick={handlePreviousMovieClick} icon={<LeftOutlined />}></Button>
                      <div className="flex flex-row">
                        <Button type="primary" danger onClick={handleGoBackButton} icon={<HomeOutlined />}>Modu Düzenle</Button>
                        <div style={{ width: '8px' }}></div> 
                        <Tooltip title="Bu moda uygun film bulamadın mı? Yenilediğinde sana yeni önerilen filmler gelecek.">
                          <Button type="primary" danger onClick={handleReloadButtonClick} icon={<ReloadOutlined />}>Karıştır</Button>
                        </Tooltip>
                      </div>
                      <Button type="primary" danger onClick={handleNextMovieClick} icon={<RightOutlined />}></Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center mt-4">
                <p className="text-white mb-4">Öneri filmi bulunamadı.</p>
                <Button type="primary" danger onClick={handleReloadButtonClick} icon={<ReloadOutlined />}>Sana daha çok film önerebilmemiz için lütfen YENİLE!</Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

const Footer = () => {
  return (
    <div className="text-white text-center py-4">
      <p>© 2024 Film Öner | <img src="/film-icon.png" alt="Film Icon" className="inline-block w-6 h-6" /></p>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('tr-TR', options);
};

export default Movies;
