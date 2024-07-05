// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { queryWithRetry } from '../../utils/queryWithRetry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body['actionType'] === 'create') {
        //登録処理

        //クエリ
        let query: string = '';
        query += 'INSERT INTO [dbo].[TrsTravelSpot]';
        query += ' ([latitude]';
        query += ' ,[longitude]';
        query += ' ,[spotName]';
        query += ' ,[spotType]';
        query += ' ,[note])';
        query += ' VALUES';
        query += ' ( ';
        query += ` \'${req.body['latitude']}\'`;
        query += ` ,\'${req.body['longitude']}\'`;
        query += ` ,\'${req.body['spotName']}\'`;
        query += ` ,0`;
        query += ` ,\'${req.body['note']}\'`;
        query += ' )';


        const result = await queryWithRetry(query);

        res.status(200).json({ message: 'OK' });

    } else if (req.body['actionType'] === 'update') {

        // //クエリ
        // let query: string = '';
        // query += 'UPDATE [dbo].[TrsCalednerEvent]';
        // query += ` SET [title] = \'${req.body['title']}\'`;
        // query += ` ,[allDay] = \'${req.body['allDay']}\'`;
        // query += ` ,[note] = \'${'テスト'}\'`;
        // query += ` ,[start] = \'${req.body['start']}\'`;
        // query += ` WHERE eventId = \'${req.body['eventId']}\'`;


        // const result = await queryWithRetry(query);

        // res.status(200).json({ message: 'OK' });

    } else if (req.body['actionType'] === 'Read') {
        // //読み込み処理

        // // クエリ
        // let query: string = '';

        // //ユーザ指定なし
        // query += 'SELECT TOP (1000) [eventId]';
        // query += ',[title]';
        // query += ',[allDay]';
        // query += ',[note]';
        // query += ',FORMAT([start],\'yyyy-MM-ddTHH:mm:ss\') AS start';
        // query += ',[end]';
        // query += 'FROM [MAILIFEDB].[dbo].[TrsCalednerEvent]';

        // if (req.body['eventId']) {
        //     query += ` WHERE [eventId] = ${req.body['eventId']}`;
        // }

        // const result = await queryWithRetry(query);

        // res.status(200).json({ message: 'OK', result: result.recordset });
    } else if (req.body['actionType'] === 'delete') {
        // //読み込み処理

        // // クエリ
        // let query: string = '';
        // query += 'DELETE FROM [dbo].[TrsCalednerEvent] ';
        // query += `WHERE [eventId] = ${req.body['eventId']}`;


        // const result = await queryWithRetry(query);

        // res.status(200).json({ message: 'OK' });
    }



}
