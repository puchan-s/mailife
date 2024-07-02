import React, { useState, useEffect, useRef } from 'react';

import InputLabel from '@mui/material/InputLabel';
import {
  Button,
  TextField
} from '@mui/material';

const CustomMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [placeName, setPlaceName] = useState<string>('');

  const center = {
    lat: 37.406847477536914,
    lng: 140.35072086510343
  };


  useEffect(() => {
    if (mapContainerRef.current) {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: center,
        zoom: 10,
        mapId: "AIzaSyCgPnyehv6XCUQeq78zkwXf7k62UMRg_tc"
      });

      new google.maps.marker.AdvancedMarkerElement({
        position: center,
        map,
        title: "Hello World!",
      });
    }
  }, []);

  /**
   * 検索ボタン押下
   */
  const mapSearch = () => {

    var geocoder = new google.maps.Geocoder();      // geocoderのコンストラクタ

    geocoder.geocode({
      address: placeName
    }, function (results, status) {

      console.log(status);
      if (status == google.maps.GeocoderStatus.OK) {

        var bounds = new google.maps.LatLngBounds();

        for (var i in results) {
          if (results[0].geometry) {
            // 緯度経度を取得
            var latlng = results[0].geometry.location;
            // 住所を取得
            var address = results[0].formatted_address;
            // 検索結果地が含まれるように範囲を拡大
            bounds.extend(latlng);
            // マーカーのセット
            setMarker(latlng);
            // マーカーへの吹き出しの追加
            setInfoW(place, latlng, address);
            // マーカーにクリックイベントを追加
            markerEvent();
          }
        }
      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        alert("見つかりません");
      } else {
        console.log(status);
        alert("エラー発生");
      }
    });


  };

  // マーカーのセットを実施する
  function setMarker(setplace) {
    // 既にあるマーカーを削除
    deleteMakers();

    var iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    marker = new google.maps.Marker({
      position: setplace,
      map: map,
      icon: iconUrl
    });
  }

  //マーカーを削除する
  function deleteMakers() {
    if (marker != null) {
      marker.setMap(null);
    }
    marker = null;
  }

  // マーカーへの吹き出しの追加
  function setInfoW(place, latlng, address) {
    infoWindow = new google.maps.InfoWindow({
      content: "<a href='http://www.google.com/search?q=" + place + "' target='_blank'>" + place + "</a><br><br>" + latlng + "<br><br>" + address + "<br><br><a href='http://www.google.com/search?q=" + place + "&tbm=isch' target='_blank'>画像検索 by google</a>"
    });
  }


  // クリックイベント
  function markerEvent() {
    marker.addListener('click', function () {
      infoWindow.open(map, marker);
    });
  }

  return (
    <div style={{ width: '100%', height: '100%' }} >
      <InputLabel id="Name-title">場所名</InputLabel>
      <TextField
        id="name"
        label="場所名"
        type="search"
        variant="filled"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={mapSearch}>
        検索
      </Button>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default CustomMap;
