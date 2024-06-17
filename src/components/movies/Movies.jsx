import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Skeleton, Tooltip, Avatar } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { HomeOutlined, LoadingOutlined, ReloadOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getMoviesByMood, getMovieVideos, getMovieReviews } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Movies = () => {
  const { mood } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [expandedReviewIndex, setExpandedReviewIndex] = useState(null);

  useEffect(() => {
    fetchRecommendedMovies();
  }, [mood, currentPage]);

  const fetchRecommendedMovies = async () => {
    try {
      setIsLoading(true);
      const fetchedMovies = await getMoviesByMood(mood, currentPage);
      const filteredMovies = fetchedMovies.filter(movie => movie.vote_average > 5 && movie.overview);
      if (!filteredMovies.length) {
        console.error('Filtreleme sonucu boş!');
        setMovies([]);
      } else {
        const moviesWithVideos = await Promise.all(filteredMovies.map(async movie => {
          const videoKey = await getMovieVideos(movie.id).catch(error => {
            console.error('Film videoları alınırken hata oluştu:', error);
            return null;
          });
          const movieReviews = await getMovieReviews(movie.id).catch(error => {
            console.error('Film yorumları alınırken hata oluştu:', error);
            return [];
          });
          return { ...movie, videoKey, reviews: movieReviews };
        }));
        setMovies(moviesWithVideos);
        setCurrentMovieIndex(0);
      }
    } catch (error) {
      console.error('Önerilen filmler alınırken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (movies.length > 0) {
      setIsReviewsLoading(true);
      setReviews(movies[currentMovieIndex].reviews);
      setIsReviewsLoading(false);
    }
  }, [currentMovieIndex, movies]);

  const handlePreviousMovieClick = () => {
    setCurrentMovieIndex(prevIndex => (prevIndex - 1 + movies.length) % movies.length);
    setExpandedReviewIndex(null); // Önceki filmde açık olan yorumu kapat
  };

  const handleNextMovieClick = () => {
    setCurrentMovieIndex(prevIndex => (prevIndex + 1) % movies.length);
    setExpandedReviewIndex(null); // Önceki filmde açık olan yorumu kapat
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

  const cleanText = (text) => {
    // HTML etiketlerini temizleme
    const cleanContent = text.replace(/<[^>]+>/g, '');
    return cleanContent;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };

  const handleExpandReview = (index) => {
    setExpandedReviewIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h3 className="mt-1" style={{ textDecoration: 'underline' }}>İşte senin için önerdiğimiz filmler!</h3>
      <div className="container mx-auto text-center flex-grow max-w-screen-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <Skeleton active paragraph={{ rows: 3 }} />
            <span className="mt-4">Senin için en iyi filmleri getiriyoruz...</span>
            <LoadingOutlined style={{ fontSize: 48, color: 'red', marginTop: '1rem' }} spin />
          </div>
        ) : (
          <>
            {movies.length > 0 ? (
              <div className="flex flex-col mt- items-center">
                <div className="rounded-lg shadow-xl p-4 mt-4 w-full max-w-screen-sm bg-gray-950">
                  <div className="flex flex-col items-start text-white">
                    <div className="w-full">
                      {(movies[currentMovieIndex].videoKey && movies[currentMovieIndex].videoKey !== null) ? (
                        <iframe
                          width="100%"
                          height="400"
                          src={`https://www.youtube.com/embed/${movies[currentMovieIndex].videoKey}`}
                          title="Film Fragmanı"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={`https://image.tmdb.org/t/p/w500/${movies[currentMovieIndex].poster_path}`}
                          alt="Film Poster"
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
                        <p><span role="img" aria-label="Yıldız">⭐</span>{parseFloat(movies[currentMovieIndex].vote_average).toFixed(1)}/10</p>
                      </div>
                    </div>
                    <div className="text-left mt-3">
                      <Card.Meta
                        description={cleanText(movies[currentMovieIndex].overview)}
                      />
                    </div>
                    <div className="flex flex-wrap mt-2">
                      {movies[currentMovieIndex].genres && movies[currentMovieIndex].genres.map((genre, index) => (
                        <Tag key={index} className="mr-2 mb-2">{genre.name}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between mt-4 w-full">
                    <Button type="primary" danger onClick={handlePreviousMovieClick} icon={<LeftOutlined />}></Button>
                    <div className="flex flex-row">
                      <Button type="primary" danger onClick={handleGoBackButton} icon={<HomeOutlined />}>Moda Geri Dön</Button>
                      <div style={{ width: '8px' }}></div>
                      <Tooltip title="Bu moda uygun film bulamadın mı? Yeniden yüklendiğinde sana yeni önerilen filmler gelecek.">
                        <Button type="primary" danger onClick={handleReloadButtonClick} icon={<ReloadOutlined />}>Karıştır</Button>
                      </Tooltip>
                    </div>
                    <Button type="primary" danger onClick={handleNextMovieClick} icon={<RightOutlined />}></Button>
                  </div>
                </div>
                <div className="mt-4 w-full max-w-screen-sm">
                  {reviews.length > 0 && (
                    <Card className="bg-gray-950 rounded-lg shadow-xl p-4" style={{ borderColor: '#333' }}>
                      {isReviewsLoading ? (
                        <Skeleton active />
                      ) : (
                        reviews.map((review, index) => (
                          <div key={index} className="mt-2">
                            <Card
                              title={review.author}
                              extra={<Avatar src={review.author_details.avatar_path ? `https://image.tmdb.org/t/p/w92${review.author_details.avatar_path}` : null} />}
                              style={{ borderColor: '#333' }}
                            >
                              <p className="text-gray-600">
                                {expandedReviewIndex === index ? cleanText(review.content) : cleanText(review.content.slice(0, 150))}
                                {review.content.length > 150 && (
                                  <span>
                                    <br />
                                    <Button
                                      type="link"
                                      onClick={() => handleExpandReview(index)}
                                      style={{
                                        color: '#FF0000',
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      {expandedReviewIndex === index ? 'Kapat' : 'Devamını Oku'}
                                    </Button>
                                  </span>
                                )}
                              </p>
                            </Card>
                          </div>
                        ))
                      )}
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-col items-center mt-4">
                <p className="mb-4">Öneri filmi bulunamadı.</p>
                <Button type="primary" danger onClick={handleReloadButtonClick} icon={<ReloadOutlined />}>Daha fazla film önermek için lütfen YENİLE!</Button>
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

export default Movies;
