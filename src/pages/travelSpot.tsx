import React, { useRef, useState, useEffect } from 'react';
import CustomMap from '../components/CustomMap';
import styles from '../styles/travelSpot.module.scss'; // 後述のCSSモジュールをインポート

import RetryableAxios from '@/utils/RetryableAxios';

import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Point } from '../utils/classes/point';
import { TextField, Button } from '@mui/material';


const travelSpot: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [userId, setUserId] = useState('');
    const [note, setNote] = useState<string>('');
    const [point, setPoint] = useState<Point>(new Point(0, 0));

    const selectRef = useRef<HTMLSelectElement>(null);

    //       'https://www.google.co.jp/maps/dir/37.4035748,140.3447985/37.4163919,140.3369021/37.4238221,140.3362155/37.4286616,140.3153586/37.4482676,140.3188071/@37.4267587,140.3442741,13.52z/data=!4m2!4m1!3e0?hl=ja&entry=ttu'

    const entry = () => {

		const newSpot = {
            actionType:'create',
			latitude: point.getPoint().lat,
			longitude: point.getPoint().lng,
			spotName: name,
			note: note
		};

        //登録
        const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
        retryableAxios.request({
            url: '/api/travelSpot',
            method: 'POST',
            data: newSpot
        })
            .then(response => {
                if (response.data.message === "OK") {
                    // 正常な動きをしたら
                }
            })
            .catch(error => console.error('Error:', error));

    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.element} style={{ width: '50vh', height: '50vh' }} >
                    <CustomMap onPoint={point} />
                </div>
                <div className={styles.element}>
                </div>
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

                    <InputLabel id="payTiming-title">種類</InputLabel>
                    <Select
                        id="userId"
                        label="種類"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value as string)
                        }
                    >
                        {/*userList
                            .map((user, idx) => (
                                <MenuItem key={idx} value={user.id}>{user.nickname}</MenuItem>
                            ))
                                */
                        }
                    </Select>


                    <InputLabel id="payType-title">備考</InputLabel>
                    <TextField
                        label="備考"
                        multiline
                        rows={4} // 初期表示の行数
                        variant="outlined"
                        fullWidth
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <br />

                    <Button variant="contained" color="primary" onClick={entry} >
                        登録
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default travelSpot;
