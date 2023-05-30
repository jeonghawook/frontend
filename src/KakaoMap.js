import React, { useEffect } from 'react';
const kakao = window.kakao;

function KakaoMap() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=b0ec7d51ba5347b70f253b74cdaa6182&libraries=services';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const mapContainer = document.getElementById('map');
      const mapOptions = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOptions);

      kakao.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        var swLatlng = bounds.getSouthWest();
        var neLatlng = bounds.getNorthEast();

        var message =
          '<p>영역좌표는 남서쪽 위도, 경도는 ' +
          swLatlng.toString() +
          '이고 <br>';
        message +=
          '북동쪽 위도, 경도는 ' + neLatlng.toString() + '입니다 </p>';

        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = message;
      });
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '350px' }}></div>
      <p>
        <em>지도 영역이 변경되면 지도 정보가 표출됩니다</em>
      </p>
      <p id="result"></p>
    </div>
  );
}

export default KakaoMap;
