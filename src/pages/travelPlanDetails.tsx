import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/travelSpot.module.scss'; // 後述のCSSモジュールをインポート

import RetryableAxios from '@/utils/RetryableAxios';

import { TextField, Button } from '@mui/material';
import CustomList from '../components/CustomList';


const travelSpot: React.FC = () => {
    const [gmapUrl, setGmapUrl] = useState<string>('');

    useEffect(() => {

        const spotParam = {
            actionType: 'Read'
        };

        //登録
        const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
        retryableAxios.request({
            url: '/api/travelSpot',
            method: 'POST',
            data: spotParam
        })
            .then(response => {
                if (response.data.message === "OK") {
                    // 正常な動きをしたら
                    
                    let workMap = 'https://www.google.co.jp/maps/dir/';
                    response.data.result.map( (value) => {
                        workMap += value.latitude + ',' + value.longitude + '/';
                    });

                    workMap += 'data=!4m2!4m1!3e0?hl=ja&entry=ttu';
                    setGmapUrl(workMap);
                }
            })
            .catch(error => console.error('Error:', error));

    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.element}>

                    <Button
                        component="a"
                        href={gmapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        color="primary"
                    >
                        地図を開く
                    </Button>

                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.element}  >
                    <CustomList data={[{name:'ネーム'},{name:'ネーム2'}]} />
                </div>
            </div>
        </div>
    );
};

export default travelSpot;
