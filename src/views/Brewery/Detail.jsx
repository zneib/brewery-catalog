import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function BreweryDetail() {
  const [brewery, setBrewery] = useState();
  const { id } = useParams();
  
  useEffect(() => {
    const getSingleBrewery = async () => {
      try {
        const res = await fetch(`https://api.openbrewerydb.org/breweries/${id}`);
        const data = await res.json();
        setBrewery(data);
      } catch (error) {
        console.log(error);
      }
    }
    getSingleBrewery();
  }, [id])

  if (!brewery) {
    return <p>Loading...</p>
  } else {
    return (
      <main>
        <h1>Brewery {id}</h1>
        <p>{brewery?.city}, {brewery?.state} {brewery?.postal_code}</p>
        <p>{brewery?.country}</p>
        <p>{brewery?.phone ? brewery?.phone : 'N/A' }</p>
        <p>
          <a href={brewery?.website_url}>View Website</a>
        </p>
        <Link to='/breweries'>Back to Breweries</Link>
      </main>
    )
  }
}
