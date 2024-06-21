import React, { useRef, useState,useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import RetryableAxios from '@/utils/RetryableAxios';
import CustomButton from '../components/CustomButton'

const SpendingList: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [money, setMoney] = useState<number | string>('');
  const [payTiming, setPayTiming] = useState<string>('');
  const [payType, setPayType] = useState<string>('');
  const [payDataType, setPayDataType] = useState<string>('');
  const [userId,setUserId] = useState('');
  const [userList,setUserList] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = () => {

    const data = {
      'actionType':'create',
      userId,
      payDataType,
      name,
      money,
      payTiming,
      payType,
      selectedDate
    };

    const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
    retryableAxios.request({
      url: '/api/spendingData',
      method: 'POST',
      data,
    })
    .then(response => {
      console.log('Success:', response.data);
      if (response.data.message === "OK") {
        // 追加の処理
      }
    })
    .catch(error => console.error('Error:', error));
  };

  useEffect(() => {

    const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
    retryableAxios.request({
      url: '/api/userData',
      method: 'POST',
      data:{
        'actionType':'lead'
      }
    })
    .then(response => {
      console.log('Success:', response.data);
      if (response.data.message === "OK") {
        // select取得時の処理
        setUserList(response.data.result);
      }
    })
    .catch(error => console.error('Error:', error));
    
  }, []); 
  

  return (
    <div>

    <InputLabel id="payTiming-title">ユーザ</InputLabel>
      <Select
        id="userId"
        label="ユーザ名"
        value={userId}
        onChange={(e) => setUserId(e.target.value as string)
        }
      >
        {userList
          .map((user,idx) => (
            <MenuItem key={idx} value={user.id}>{user.nickname}</MenuItem>
          ))
        }
      </Select>

      <InputLabel id="payTiming-title">データ種別</InputLabel>
      <Select
        id="payDataType"
        label="データ種別"
        value={payDataType}
        onChange={(e) => setPayDataType(e.target.value as string)}
      >
        <MenuItem value={'1'}>支出</MenuItem>
        <MenuItem value={'2'}>収入</MenuItem>
      </Select>

      <InputLabel id="Name-title">商品</InputLabel>
      <TextField
        id="name"
        label="商品"
        type="search"
        variant="filled"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <InputLabel id="money-title">支払い金額</InputLabel>
      <TextField
        id="money"
        label="金額"
        type="search"
        variant="filled"
        value={money}
        onChange={(e) => setMoney(e.target.value)}
      />

      <InputLabel id="payTiming-title">支払いタイミング</InputLabel>
      <Select
        id="payTiming"
        label="支払いタイミング"
        value={payTiming}
        onChange={(e) => setPayTiming(e.target.value as string)}
        inputRef={selectRef}
      >
        <MenuItem value={'1'}>1回</MenuItem>
        <MenuItem value={'2'}>毎週</MenuItem>
        <MenuItem value={'3'}>毎月</MenuItem>
      </Select>

      <InputLabel id="payType-title">種別</InputLabel>
      <Select
        id="payType"
        label="種別"
        value={payType}
        onChange={(e) => setPayType(e.target.value as string)}
      >
        <MenuItem value={'1'}>食費</MenuItem>
        <MenuItem value={'2'}>IT</MenuItem>
        <MenuItem value={'3'}>娯楽</MenuItem>
      </Select>


      <InputLabel id="payType-title">日付</InputLabel>
      <TextField
      id="date"
      label="日付"
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
    />

      <br />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        登録
      </Button>

      <CustomButton routePath='SpendingList' context='一覧へ戻る' />
    </div>
  );
};

export default SpendingList;
