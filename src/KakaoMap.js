import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
   
import axios from 'axios';

function KakaoMap() {
  const [myLatitude, setMyLatitude] = useState(null);
  const [myLongitude, setMyLongitude] = useState(null);
  const [listData, setListData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedListData, setSearchedListData] = useState([]);


  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
        const latitude = response.data.latitude;
        const longitude = response.data.longitude;
        setMyLatitude(latitude);
        setMyLongitude(longitude);
      } catch (error) {
        console.error('Failed to fetch coordinates:', error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    if (myLatitude !== null && myLongitude !== null) {
      const script = document.createElement('script');
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=b0ec7d51ba5347b70f253b74cdaa6182&libraries=services';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        const mapContainer = document.getElementById('map');
        const mapOptions = {
          center: new window.kakao.maps.LatLng(myLatitude, myLongitude),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOptions);

        window.kakao.maps.event.addListener(map, 'click', function () {
          sendCoordinatesToBackend(map);
        });

        window.kakao.maps.event.addListener(map, 'dragend', function () {
          sendCoordinatesToBackend(map);
        });

        sendCoordinatesToBackend(map);
      };
    }
  }, [myLatitude, myLongitude]);

  const sendCoordinatesToBackend = async (map) => {
    try {
      const bounds = map.getBounds();
      const swLatlng = bounds.getSouthWest();
      const neLatlng = bounds.getNorthEast();

      const response = await axios.post(
        'http://localhost:3300/places/coordinates',
        {
          swLatlng,
          neLatlng,
        }
      );

      if (response) {
        const storeData = response.data['근처식당목록'];
        setListData(storeData);

        // Clear existing markers
        // ...

        // const positions = [
        //   {
        //     content: `<div>살려줘</div>`,
        //     latlng: new window.kakao.maps.LatLng(37.7562, 126.7865),
        //   },
        //   {
        //     content: '<div>나도</div>',
        //     latlng: new window.kakao.maps.LatLng(37.7552, 126.7855),
        //   },
        //   {
        //     content: '<div>자고</div>',
        //     latlng: new window.kakao.maps.LatLng(37.7542, 126.7845),
        //   },
        //   {
        //     content: '<div>싶어...4시야 또</div>',
        //     latlng: new window.kakao.maps.LatLng(37.7532, 126.7835),
        //   },
        // ];

        // for (let i = 0; i < positions.length; i++) {
        //   const marker = new window.kakao.maps.Marker({
        //     map: map,
        //     position: positions[i].latlng,
        //   });

        //   const infowindow = new window.kakao.maps.InfoWindow({
        //     content: positions[i].content,
        //   });

        for (let i = 0; i < storeData.length; i++) {
          const position = storeData[i];
          console.log(position);
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(position.La, position.Ma),
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div>${position.storeName}</div>`,
          });

          window.kakao.maps.event.addListener(
            marker,
            'mouseover',
            makeOverListener(map, marker, infowindow)
          );
          window.kakao.maps.event.addListener(
            marker,
            'mouseout',
            makeOutListener(infowindow)
          );
        }
      }
    } catch (error) {
      console.error('Failed to send coordinates to backend:', error);
    }
  };

  function makeOverListener(map, marker, infowindow) {
    return function () {
      infowindow.open(map, marker);
    };
  }

  function makeOutListener(infowindow) {
    return function () {
      infowindow.close();
    };
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3300/places/search?keyword=${searchTerm}`);

      if (response) {
        const storeData = response.data;
        setSearchedListData(storeData);
      }
    } catch (error) {
      console.error('Failed to search for places:', error);
    }
  
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '350px' }}></div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
      {searchedListData.length > 0
  ? searchedListData.map((store) => (
      <li key={store.id}>
        <Link to={`/store/${store.id}`}>{store.name}</Link>
      </li>
    ))
  : listData.map((store) => (
      <li key={store.id}>
        <Link to={`/store/${store.id}`}>{store.name}</Link>
      </li>
    ))}

      </ul>
    </div>
  );
}

export default KakaoMap;
