import React, { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import RetryableAxios from '@/utils/RetryableAxios';

const SpendingList: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [money, setMoney] = useState<number | string>('');
  const [payTiming, setPayTiming] = useState<string>('');
  const [payType, setPayType] = useState<string>('');
  
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = () => {
    if (selectRef.current) {
      alert(`Selected Value: ${selectRef.current.value}`);
    }

    const data = {
      'actionType':'create',
      name,
      money,
      payTiming,
      payType,
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

  return (
    <div>
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

      <br />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        登録
      </Button>
    </div>
  );
};

export default SpendingList;
