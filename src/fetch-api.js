import axios from 'axios';

export async function fetchImages(query, page) {
  const searchParams = new URLSearchParams({
    key: '37122000-0bcce40d460a6d1aa909b79c0',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}

