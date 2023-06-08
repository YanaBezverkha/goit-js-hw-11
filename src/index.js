import { fetchImages } from './fetch-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search-form'),
  container: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
  input: document.querySelector('input'),
};

refs.btnMore.classList.add('is-hidden');
refs.form.addEventListener('submit', loadGallery);
refs.btnMore.addEventListener('click', loadMore);
let page = 1;
let searchQuery = '';

async function loadGallery(event) {
  event.preventDefault();
  searchQuery = refs.input.value.toLocaleLowerCase().trim();
  page = 1;

  if (searchQuery === '') {
    Notify.failure('Please, enter some value and try again.');
    refs.form.reset();
    return;
  }
  if (!refs.btnMore.classList.contains('is-hidden')) {
    refs.btnMore.classList.add('is-hidden');
  }

  try {
    const resp = await fetchImages(searchQuery, page);
    const element = resp.data.hits;
    if (element.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    refs.container.innerHTML = '';
    createMarkup(element);
    refs.form.reset();
    refs.btnMore.classList.remove('is-hidden');
    checkPage(resp.data.totalHits, page);
  } catch (err) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function loadMore() {
  page += 1;
  try {
    const resp = await fetchImages(searchQuery, page);
    const element = resp.data.hits;
    createMarkup(element);
    checkPage(resp.data.totalHits, page);
  } catch (err) {
    console.log(err);
  }
}

function createMarkup(element) {
  const markup = element
    .map(el => {
      return `<div class="photo-card">
    <img src="${el.largeImageURL}" alt="${el.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"> ${el.likes}
        <b>Likes</b>
      </p>
      <p class="info-item"> ${el.views}
        <b>Views</b>
      </p>
      <p class="info-item"> ${el.comments}
        <b>Comments</b>
      </p>
      <p class="info-item"> ${el.downloads}
        <b>Downloads</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
  refs.container.insertAdjacentHTML('beforeend', markup);
}

function checkPage(allPage, currentPage) {
  if (Math.ceil(allPage / 40) <= currentPage) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.btnMore.classList.add('is-hidden');
  }
}
