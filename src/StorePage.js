import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StorePage() {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [number, setNumber] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`http://localhost:3300/places/${storeId}`);
        const storeData = response.data;
        setStoreData(storeData);
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleClick = async () => {
    try {
      const response = await axios.post(`http://localhost/${storeId}/waitings`, {
        peopleCnt: parseInt(number),
      });

      // Handle the response or perform any other necessary actions
      console.log(response.data);
    } catch (error) {
      console.error('Failed to send number to backend:', error);
    }
  };

  if (!storeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Store Page for ID: {storeId}</h2>
      <p>Store Name: {storeData.name}</p>
      <p>Address: {storeData.address}</p>
      <input type="number" value={number} onChange={handleChange} />
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

export default StorePage;
