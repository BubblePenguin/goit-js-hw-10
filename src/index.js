import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

function clear() {
  refs.ul.innerHTML = '';
  refs.div.innerHTML = '';
}

refs.input.addEventListener(
  'input',
  debounce(e => {
    clear();
    const text = e.target.value.trim();
    if (!text) {
      return;
    }
    fetchCountries(text)
      .then(value => {
        if (value.length > 10) {
          Notiflix.Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );

          return;
        }
        if (value.length === 1) {
          refs.div.innerHTML = `<h2>
        <img src="${value[0].flags.svg}" alt="${
            value[0].flags.alt
          }" width="30" /> ${value[0].name.common}
      </h2>
      <p><strong>Capital:</strong> ${value[0].capital}</p>
      <p><strong>Population:</strong> ${value[0].population}</p>
      <p><strong>Languages:</strong> ${Object.values(value[0].languages).join(
        ', '
      )}</p>`;
          return;
        }
        if (value.length <= 10) {
          refs.ul.innerHTML = value
            .map(v => {
              return `<li><p><img src="${v.flags.svg}" alt="${v.flags.svg}" width="20"> ${v.name.common}</p></li>`;
            })
            .join('');
          return;
        }

        Notiflix.Notify.failure('Oops, there is no country with that name');
      })
      .catch(() => {
        Notiflix.Notify.failure('Im catch, and if you see me, its ur fault.');
      });
  }, DEBOUNCE_DELAY)
);
