import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import instance from '../api/interceptor';

function StorePage() {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [number, setNumber] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await instance.get(`/places/${storeId}`);
        const storeData = response.data;
        setStoreData(storeData);
        console.log(storeData);
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      }
    };
  
    fetchStoreData();
  }, [storeId]);
  

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      console.log("CEHCK1")
      const response = await instance.post(`/stores/${storeId}/waitings`, {
        peopleCnt: parseInt(number),
      });                   
      console.log("CHECK2")
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
      <h2>일단 잘보이게 스토어 아이디: {storeId}</h2>
      <p>상점이름: {storeData.storeName}</p>
      <p>주소: {storeData.address}</p>
      <input type="number" value={number} onChange={handleChange} />
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

export default StorePage;
