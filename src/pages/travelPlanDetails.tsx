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
    Select
} from '@mui/material';


const travelSpot: React.FC = () => {
    const spotListRefArray = useRef<(CustomListHandle | null)[]>([]);
    const [initListData, setInitListData] = useState<object>(new Object());
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

    function spotDelete(event: React.MouseEvent<HTMLButtonElement>) {

        const values: string[] = event.currentTarget.value.split(',');

        console.log(values);
        const workItems: (listData[] | undefined) = spotListRefArray.current[Number(values[0])]?.getData();

        if (workItems) {
            spotListRefArray.current[Number(values[0])]?.setData(workItems.filter(item => item.getId() !== values[1]));
        }
    }

    function spotViewFunc(data: listData) {
        return (
            <div>
                <p>場所：{data.getMasterData().spotName}</p>
                <p>備考</p>
                <p>{data.getMasterData().note}</p>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={spotDelete}
                    value={data.getMasterData().dayNum + ',' + data.getId()}
                >
                    X
                </Button>
            </div>
        );
    }

    function openAddSpotData(event: React.MouseEvent<HTMLButtonElement>) {

        setSelectAddNum(Number(event.currentTarget.value));

        const spotParam = {
            actionType: 'Read'
        };

        //参照
        const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
        retryableAxios.request({
            url: '/api/travelSpot',
            method: 'POST',
            data: spotParam
        })
            .then(response => {
                if (response.data.message === "OK") {
                    // 正常な動きをしたら

                    setSpotDataList(response.data.result);
                    setNewOpen(true);
                }
            })
            .catch(error => console.error('Error:', error));

    }

    function addSpotData() {

        const maxId: (number | undefined) = spotListRefArray.current[selectAddNum]?.getItemMaxId();
        const workItems: (listData[] | undefined) = spotListRefArray.current[selectAddNum]?.getData();
        const selectSpotData = spotDataList.filter((value) => value.travelSpotID === selectSpotId);


        if (maxId && workItems) {
            selectSpotData[0]['dayNum'] = selectAddNum;
            const addData: listData = new listData(maxId, spotViewFunc, selectSpotData[0]);
            workItems.push(addData);
            spotListRefArray.current[selectAddNum]?.setData(workItems);
        }

        setNewOpen(false);
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

    function savePlan() {

        let values: object[] = [];
        spotListRefArray.current.map((value: (CustomListHandle | null)) => {
            value?.getData().map((data: listData, idx: number) => {
                values.push({
                    PlanId: data.getMasterData().PlanId
                    , SpotId: data.getMasterData().SpotId
                    , PlanDate: data.getMasterData().PlanDate
                    , SeqNo: idx
                });
            });
        });

        const spotDeleteParam = {
            actionType: 'delete',
            PlanId: values[0].PlanId
        };

        const spotCreateParam = {
            actionType: 'create',
            values
        };

        //削除
        const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
        retryableAxios.request({
            url: '/api/planSpot',
            method: 'POST',
            data: spotDeleteParam
        })
        .then(response => {
            if (response.data.message === "OK") {
            }
        })
        .catch(error => console.error('Error:', error));

        //登録
        retryableAxios.request({
            url: '/api/planSpot',
            method: 'POST',
            data: spotCreateParam
        })
        .then(response => {
            if (response.data.message === "OK") {
            }
        })
        .catch(error => console.error('Error:', error));

    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.element}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={mapOpenClick}
                        value='ALL'
                    >
                        全体の移動マップ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={savePlan}
                    >
                        保存
                    </Button>
                </div>
            </div>
            <div className={styles.right}>
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
                        {/*スポット追加ボタン*/}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openAddSpotData}
                            value={idx}
                        >
                            追加
                        </Button>
                        <CustomList ref={el => (spotListRefArray.current[idx] = el)} data={initListData[value]} />
                    </div>
                ))}
            </div>
            {/* イベント登録ダイアログ */}
            <Dialog open={newOpen} onClose={() => setNewOpen(false)}>
                <DialogTitle>スポットを追加</DialogTitle>
                <DialogContent>
                    <InputLabel id="payType-title">追加スポット</InputLabel>
                    <Select
                        id="payType"
                        label="追加スポット"
                        value={selectSpotId}
                        onChange={(e) => setSelectSpotId(e.target.value)}
                    >
                        {spotDataList.map((value, idx) => (
                            <MenuItem key={idx} value={value.travelSpotID}>{value.spotName}</MenuItem>
                        ))}
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewOpen(false)} color="secondary">
                        キャンセル
                    </Button>
                    <Button onClick={addSpotData} color="primary">
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default travelSpot;
