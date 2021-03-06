import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function BreweryList() {
  const [breweries, setBreweries] = useState([]);
  const [searchedBreweries, setSearchedBreweries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortingToggle, setSortingToggle] = useState('Ascending');

  const getBreweryList = useCallback(
    async () => {
      try {
        const res = await fetch(`https://api.openbrewerydb.org/breweries?per_page=10`);
        const data = await res.json();
        const sortedData = sortingToggle === 'Ascending' 
          ? data.sort((a, b) => a.name.localeCompare(b.name)) 
          : data.sort((a, b) => b.name.localeCompare(a.name));
        setBreweries(sortedData);
      } catch (error) {
        console.error(error);
      }
    }, [sortingToggle]
  )

  useEffect(() => {
    getBreweryList();
  }, [getBreweryList])

  useEffect(() => {
    if (searchedBreweries?.length > 0) {
      const sortedData = sortingToggle === 'Ascending'
        ? searchedBreweries.sort((a, b) => a.name.localeCompare(b.name)) 
        : searchedBreweries.sort((a, b) => b.name.localeCompare(a.name));
      setSearchedBreweries(sortedData);
    }
  }, [searchedBreweries, searchedBreweries?.length, sortingToggle])

  const searchBreweries = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://api.openbrewerydb.org/breweries/search?query=${searchTerm}`);
      const data = await res.json();
      const sortedData = sortingToggle === 'Ascending' 
        ? data.sort((a, b) => a.name.localeCompare(b.name)) 
        : data.sort((a, b) => b.name.localeCompare(a.name));
      setSearchedBreweries(sortedData);
    } catch (error) {
      console.error(error);
    }
  }

  const handleReset = () => {
    setSearchTerm('');
  }

  return (
    <main>
      <h1>Brewery Catalog</h1>
      <form onSubmit={searchBreweries}>
        <input type='text' name='search' placeholder='Find a brewery' onChange={(e) => setSearchTerm(e.target.value)} />
        <div className="btn-wrapper">
          <button type='submit'>Search</button>
          <button type='reset' onClick={handleReset}>Reset</button>
        </div>
      </form>
      <button onClick={() => setSortingToggle(sortingToggle === 'Ascending' ? 'Descending' : 'Ascending')}>
        Sort {sortingToggle === 'Ascending' ? 'Descending' : 'Ascending'}
      </button>
      <ul>
        {!searchTerm && breweries?.length > 0 && breweries.map(({ city, id, name, state }, index) => (
          <li key={id}>
            {index + 1} - <Link to={`/breweries/${id}`}>{name}</Link> - {city}, {state}
          </li>
        ))}
        {searchTerm && searchedBreweries?.length > 0 && searchedBreweries.map(({ city, id, name, state }, index) => (
          <li key={id}>
            {index + 1} - <Link to={`/breweries/${id}`}>{name}</Link> - {city}, {state}
          </li>
        ))}
      </ul>
    </main>
  );
}

