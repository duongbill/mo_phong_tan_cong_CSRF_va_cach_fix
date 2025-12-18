import { movieService } from '../../services/api';

export const newsList = async () => {
  try {
    const movies = await movieService.getMovies();
    return movies.slice(0, 5).map((movie, index) => ({
      id: movie.id || index + 1,
      title: movie.title,
      author: index % 2 === 0 ? 'Ivy_Trat' : 'Moveek',
      time: `${4 + index} ngày trước`,
      category: movie.genres?.[0] || 'Tin điện ảnh',
      description: movie.description?.slice(0, 160) + '...',
      image: movie.posterUrl || movie.poster,
    }));
  } catch (error) {
    console.error('Error fetching news list:', error);
    return [];
  }
};

export const getNewsById = async (id) => {
  try {
    const allNews = await newsList();
    const news = allNews.find((item) => item.id === parseInt(id));
    return news || null;
  } catch (error) {
    console.error('Error fetching news by id:', error);
    return null;
  }
};

export const categories = [
  {
    id: 'review',
    title: 'Đánh giá phim',
    description: 'Góc nhìn chân thực, khách quan nhất về các bộ phim chiếu rạp.',
  },
  {
    id: 'news',
    title: 'Tin điện ảnh',
    description: 'Cập nhật tin tức điện ảnh Việt Nam & thế giới mới nhất.',
  },
  {
    id: 'trailer',
    title: 'Video - Trailer',
    description: 'Trailer, video phim chiếu rạp và truyền hình hot nhất.',
  },
];