## **OVERVIEW**
<image src="https://github.com/jeonghawook/frontend/assets/126029736/ee822ca5-bd3b-48a2-84b3-c349fc29f96d">

<br>





정 하 욱 6




<table>
 <tr>
    <td><strong>KAKAOMAP</strong></td>
    <td> 카카오맵을 통해 실시간 위치 정보 및 매핑 구현 (순수 DB). <br />
   </td>
  </tr>
  <tr>
    <td><strong>UseQuery</strong></td>
    <td> - 실시간 데이터 조회로 벡엔드와 Sync 구현. 프론트 캐싱 추가.
useEffect 를 사용했다가 cache기능과 실시간 데이터 fetching에 있어서 부족하다
느껴 다른 hook인 usequery를 선택했습니다.<br />
</td>
  </tr>
  <tr>
    <td><strong>Axios</strong></td>
    <td>- 벡엔드와 통신 기능으로 interceptor 를 통해 토큰 해독 및 받기 / 보내기 구현.<br />
</td>
  </tr>
  <tr>
    <td><strong>Zustand</strong></td>
    <td>- Redux 의 간편한 버전으로 보다 편리하게 상태 관리 기능 구현.
Redux의 경우 PersistGate 사용 시 화면을 rendering 하기 전에 상태를 저장한다.
이 시간을 1초 혹은 더 줄여서 사용을 했을 때 문제가 없었지만, 만약 시간 제한을
너무 빨리 둬서 상태를 저장하기 전에 1초가 지나면 상태 관리에 문제가 생길 것
같아서 이런 제한 없이 상태 값을 유지 시켜줄 수 있는 zustand를 사용했습니다.</td>
  </tr>
 
</table>
