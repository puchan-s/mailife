import React, { useRef, useState, useEffect } from 'react';
import CustomMap from '../components/CustomMap';
import styles from '../styles/travelSpot.module.scss'; // 後述のCSSモジュールをインポート


import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import RetryableAxios from '@/utils/RetryableAxios';
import CustomButton from '../components/CustomButton';


const travelSpot: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [money, setMoney] = useState<number | string>('');
    const [payTiming, setPayTiming] = useState<string>('');
    const [payType, setPayType] = useState<string>('');
    const [payDataType, setPayDataType] = useState<string>('');
    const [userId, setUserId] = useState('');
    const [userList, setUserList] = useState([]);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const selectRef = useRef<HTMLSelectElement>(null);




    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.element} style={{ width: '50vh', height: '50vh' }} >
                    <CustomMap />
                </div>
                <div className={styles.element}>Left 2</div>
            </div>
            <div className={styles.right}>
                <div className={styles.element} style={{ width: '50vh', height: '90vh' }} >

                    <InputLabel id="Name-title">場所名</InputLabel>
                    <TextField
                        id="name"
                        label="場所名"
                        type="search"
                        variant="filled"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <InputLabel id="payType-title">到着時間</InputLabel>
                    <TextField
                        id="date"
                        label="到着時間"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <InputLabel id="payTiming-title">種類</InputLabel>
                    <Select
                        id="userId"
                        label="種類"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value as string)
                        }
                    >
                        {userList
                            .map((user, idx) => (
                                <MenuItem key={idx} value={user.id}>{user.nickname}</MenuItem>
                            ))
                        }
                    </Select>


                    <InputLabel id="payType-title">備考</InputLabel>
                    <TextField
                        label="備考"
                        multiline
                        rows={4} // 初期表示の行数
                        variant="outlined"
                        fullWidth
                    />

                    <br />

                    <Button variant="contained" color="primary" >
                        登録
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default travelSpot;
