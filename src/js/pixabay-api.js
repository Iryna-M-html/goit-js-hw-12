import axios from 'axios';
const API_KEY = '51392079-b36bb30a852bc284302a63f16';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page=1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: PER_PAGE, //кількість сторінок на сторінку
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
