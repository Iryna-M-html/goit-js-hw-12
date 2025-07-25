import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('#search-form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
const PER_PAGE = 15;

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: '❌ Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (PER_PAGE >= totalHits) {
      iziToast.info({
        title: 'End of Results',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    // Scroll
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const totalLoaded = currentPage * PER_PAGE;
    if (totalLoaded >= totalHits) {
      iziToast.info({
        title: 'End of Results',
        message: 'You have reached the end of the results.',
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Could not load more images.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});



