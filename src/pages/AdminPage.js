import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  useAuthStore from '../api/store';
import instance from '../api/interceptor';


function AdminPage() {
  const [listData, setListData] = useState([]);
  const {StoreId} = useAuthStore();
  const [number, setNumber] = useState('');

  useEffect(() => {
    fetchListData();
  }, []);

  const fetchListData = async () => {
    try {
      const response = await instance.get(`/stores/${StoreId}/waitings/list`);
      console.log(response)
      if(response){
      const data = response.data;
      console.log(data);
      setListData(data);
      
      }
    } catch (error) {
      console.error('Failed to fetch list data:', error);
    }
  };
  
  const handleChange = (e) => {
    setNumber(e.target.value);
  };


  const handleClickEntering = async (userId) => {
    try {
      await instance.post(`/stores/${StoreId}/waitings/${userId}/entered`,
      {peopleCnt : parseInt(number)});
      fetchListData();
    } catch (error) {
      console.error('Failed to enter:', error);
    }
  };

  const handleClickEnter = async (waitingId) => {
    try {
      await instance.post(`/stores/${StoreId}/waitings/${waitingId}?status=ENTERED`);
      fetchListData();
    } catch (error) {
      console.error('Failed to mark as waiting:', error);
    }
  };

  const handleClickDelayed = async (waitingId) => {
    try {
      await instance.post(`/stores/${StoreId}/waitings/${waitingId}?status=DELAYED`);
      fetchListData();
    } catch (error) {
      console.error('Failed to mark as delayed:', error);
    }
  };

  const handleClickExited = async (waitingId) => {
    try {
      await instance.post(`/stores/${StoreId}/waitings/${waitingId}?status=EXITED`);
      fetchListData();
    } catch (error) {
      console.error('Failed to mark as delayed:', error);
    }
  };

  return (
    <div>
      <h2>List View (Admin)</h2>
      {listData.length === 0 ? (
        <div>
            <input type="number" value={number} onChange={handleChange} />
        <button onClick={() => handleClickEntering(number)}>바로 입장</button>
        <div>더 열심히 일하세요 왜 손님이 없을까요</div>
        </div>
      ) : (
        <ul>
            <input type="number" value={number} onChange={handleChange} />
              <button onClick={() => handleClickEntering(number)}>바로 입장</button>
          {listData.map((item) => (
            <li key={item.id}>
              <p>ID: {item.id}</p>
              <p>Status: {item.status}</p>
            
              <button onClick={() => handleClickEnter(item.id)}>입장</button>
              <button onClick={() => handleClickDelayed(item.id)}>연기</button>
              <button onClick={() => handleClickExited(item.id)}>퇴장</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPage;
