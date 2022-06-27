import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function BreweryList() {
  const [breweries, setBreweries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortingToggle, setSortingToggle] = useState('Ascending');

  const getBreweryList = useCallback(
    async () => {
      try {
        const res = await fetch(`https://api.openbrewerydb.org/breweries?per_page=10`);
        const data = await res.json();
        const sortedData = sortingToggle === 'Ascending' ? data.sort((a, b) => a.name.localeCompare(b.name)) : data.sort((a, b) => b.name.localeCompare(a.name));
        setBreweries(sortedData);
      } catch (error) {
        console.error(error);
      }
    }, [sortingToggle]
  )

  useEffect(() => {
    getBreweryList();
  }, [getBreweryList])

  const searchBreweries = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://api.openbrewerydb.org/breweries/search?query=${searchTerm}`);
      const data = await res.json();
      setBreweries(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleReset = () => {
    setSearchTerm('');
    getBreweryList();
  }

  return (
    <main>
      <h1>Brewery Catalog</h1>
      <form onSubmit={searchBreweries}>
        <input type='text' name='search' placeholder='Find a brewery' onChange={(e) => setSearchTerm(e.target.value)} />
        <button type='submit'>Search</button>
        <button type='reset' onClick={handleReset}>Reset</button>
      </form>
      <button onClick={() => setSortingToggle(sortingToggle === 'Ascending' ? 'Descending' : 'Ascending')}>
        Sort {sortingToggle === 'Ascending' ? 'Descending' : 'Ascending'}
      </button>
      <ul>
        {breweries?.length > 0 && breweries.map(({ city, id, name, state}) => (
          <li key={id}>
            <Link to={`/breweries/${id}`}>{name}</Link> - {city}, {state}
          </li>
        ))}
      </ul>
    </main>
  );
}

