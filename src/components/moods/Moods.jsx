import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';

const Moods = () => {
  const moods = [
    { name: 'Mutlu', emoji: '😄' },
    { name: 'Heyecanlı', emoji: '😃' },
    { name: 'Hüzünlü', emoji: '😢' },
    { name: 'Sakin', emoji: '😌' },
    { name: 'Korkulu', emoji: '😱' },
    { name: 'Meraklı', emoji: '🤨' },
    { name: 'Şaşırtıcı', emoji: '😲' },
    { name: 'Tuhaf', emoji: '🤪' },
    { name: 'Romantik', emoji: '😍' },
    { name: 'Komik', emoji: '😂' },
    { name: 'Hayalperest', emoji: '🤩' },
    { name: 'Maceraperest', emoji: '🏃' },
    { name: 'Melankolik', emoji: '😞' },
    { name: 'Duygusal', emoji: '😭' },
    { name: 'Aksiyon Dolu', emoji: '💥' },
    { name: 'Vurdulu Kırdılı', emoji: '⚔️' },
    { name: 'Tarihsel', emoji: '🏛︎' },
    { name: 'Sanatsal', emoji: '🎶📻' },
  ];

  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto py-5 px-4 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
          Ruh halinize göre en <br className="lg:inline hidden" /> beğenilen filmleri keşfedin
        </h2>
        <h4 className="text-base md:text-lg lg:text-xl mt-5 font-semibold text-white mb-4">
          Şimdi nasıl hissediyorsun?
        </h4>
        <Row gutter={[16, 16]} justify="center">
          {moods.map((mood, index) => (
            <Col key={index} xs={12} sm={8} md={6} lg={4}>
              <Link to={{
                pathname: `/movies/${mood.name}`,
                state: { mood: mood.name }
              }}>
                <div
                  className="bg-white border-2 border-red-500 rounded-lg p-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md hover:text-red-500"
                  onClick={() => handleMoodClick(mood.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <p className="text-base md:text-lg lg:text-xl mt-2">{mood.name}</p>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      {/* Footer */}
      <div className="mt-auto py-5 text-white text-center">
        <p>© 2024 Film Öner | <img src="/film-icon.png" alt="Film Icon" className="inline-block w-6 h-6" /></p>
      </div>
    </div>
  );
};

export default Moods;
