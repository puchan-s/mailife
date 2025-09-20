import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/travelSpot.module.scss'; // 後述のCSSモジュールをインポート

import RetryableAxios from '@/utils/RetryableAxios';

import { CustomList, listData, CustomListHandle } from '../components/CustomList';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    InputLabel,
    Select,
    Box,
    Grid,
    Typography
} from '@mui/material';


const travelSpot: React.FC = () => {
    const spotListRefArray = useRef<(CustomListHandle | null)[]>([]);
    const [initListData, setInitListData] = useState<object>(new Object());
    const [travelWhole, setTravelWhole] = useState<object>(new Object());
    const [newOpen, setNewOpen] = useState(false);
    const [selectAddNum, setSelectAddNum] = useState<number>(0);
    const [spotDataList, setSpotDataList] = useState<object[]>([]);
    const [selectSpotId, setSelectSpotId] = useState<string>('');


    useEffect(() => {

        const spotParam = {
            actionType: 'Read'
        };

        //取得
        const retryableAxios = new RetryableAxios(3); // 最大3回リトライする

        //プラン全体の内容を取得する
        retryableAxios.request({
            url: '/api/travelWhole',
            method: 'POST',
            data: spotParam
        })
            .then(response => {
                if (response.data.message === "OK") {
                    // 正常な動きをしたら
                    setTravelWhole(response.data.result[0]);
                }
            })
            .catch(error => console.error('Error:', error));

        //プラン詳細の内容を取得する
        retryableAxios.request({
            url: '/api/planSpot',
            method: 'POST',
            data: spotParam
        })
            .then(response => {
                if (response.data.message === "OK") {
                    // 正常な動きをしたら

                    const worklistData: object = new Object();
                    let listDataNum = -1;
                    response.data.result.map((value: object, idx: number) => {

                        const workValue = value;

                        if (!worklistData[value.PlanDate]) {
                            worklistData[value.PlanDate] = [];
                            listDataNum++;
                        }

                        workValue['dayNum'] = listDataNum;

                        const data = new listData(idx, spotViewFunc, value);
                        worklistData[value.PlanDate].push(data);
                    });

                    setInitListData(worklistData);
                }
            })
            .catch(error => console.error('Error:', error));

    }, []);

    function spotViewFunc(data: listData) {
        return (
            <div>
                <p>場所：{data.getMasterData().spotName}</p>
                <p>備考</p>
                <p>{data.getMasterData().note}</p>
            </div>
        );
    }

    function mapOpenClick(event: React.MouseEvent<HTMLButtonElement>) {

        let url = 'https://www.google.co.jp/maps/dir/';

        const value = event.currentTarget.value;

        if (value === 'ALL') {
            //プラン全体
            spotListRefArray.current.map((value: (CustomListHandle | null)) => {
                value?.getData().map((data: listData) => {
                    url += data.getMasterData().latitude + ',' + data.getMasterData().longitude + '/';
                });
            });
        } else {
            //プラン1日文
            spotListRefArray.current[Number(value)]?.getData().map((data: listData) => {
                url += data.getMasterData().latitude + ',' + data.getMasterData().longitude + '/';
            });
        }
        url += 'data=!4m2!4m1!3e0?hl=ja&entry=ttu';

        window.open(url, '_blank');
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
                {/* 上に1つのエレメント */}
                <Grid item xs={12}>
                    <Box sx={{ backgroundColor: 'lightblue', padding: 2 }}>
                        <Typography variant="h6" align="center">{travelWhole.PlanName}</Typography>
                    </Box>
                </Grid>
                {/* 下に3つのエレメント */}
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={4}>
                        <Box sx={{ backgroundColor: 'lightgreen', padding: 2 }}>
                            <Typography variant="body1" align="center">下のエレメント1</Typography>
                            {Object.keys(initListData).map((value, idx) => (
                                <div className={styles.element} key={idx} >
                                    <span>{value}</span>
                                    {/*マップ表示ボタン（日別）*/}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={mapOpenClick}
                                        value={idx}
                                    >
                                        移動マップ
                                    </Button>
                                    <CustomList ref={el => (spotListRefArray.current[idx] = el)} data={initListData[value]} />
                                </div>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ backgroundColor: 'lightcoral', padding: 2 }}>
                            <Typography variant="body1" align="center">下のエレメント2</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ backgroundColor: 'lightgoldenrodyellow', padding: 2 }}>
                            <Typography variant="body1" align="center">下のエレメント3</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default travelSpot;
