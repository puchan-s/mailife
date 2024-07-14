// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { queryWithRetry } from '../../utils/queryWithRetry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.body['actionType'] === 'create') {
        //登録処理

        //クエリ
        let query: string = '';
        query += 'INSERT INTO [dbo].[TrsTravelPlanSpot]';
        query += ' ([PlanId]';
        query += ' ,[SpotId]';
        query += ' ,[PlanDate]';
        query += '  ,[SeqNo])';
        query += ' VALUES';

        req.body['values'].map((value) => {
            query += ' ( ';
            query += ` \'${value.PlanId}\'`;
            query += ` ,\'${value.SpotId}\'`;
            query += ` ,\'${value.PlanDate}\'`;
            query += ` ,\'${value.SeqNo}\'`;
            query += ' ),';
        });

        query = query.substring(0,query.length - 1);

        const result = await queryWithRetry(query);

        res.status(200).json({ message: 'OK' });

    } else if (req.body['actionType'] === 'update') {

        //クエリ
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
        //読み込み処理

        // // クエリ
        let query: string = '';


        query += ' SELECT ';
        query += ' TTPS.PlanId,'
        query += ' TTPS.SpotId,'
        query += ' TTS.spotName,';
        query += ' TTS.latitude,';
        query += ' TTS.longitude,';
        query += ' FORMAT(TTPS.PlanDate,\'yyyy-MM-dd\') AS PlanDate, ';
        query += ' TTS.note';
        query += ' FROM ';
        query += ' TrsTravelPlan AS TTP';
        query += ' LEFT JOIN TrsTravelPlanSpot AS TTPS ON TTP.PlanId = TTPS.PlanId';
        query += ' LEFT JOIN TrsTravelSpot AS TTS ON TTPS.SpotId = TTS.travelSpotID';
        query += ' ORDER BY TTPS.PlanDate,TTPS.SeqNo';

        // if (req.body['eventId']) {
        //     query += ` WHERE [eventId] = ${req.body['eventId']}`;
        // }

        const result = await queryWithRetry(query);

        res.status(200).json({ message: 'OK', result: result.recordset });
    } else if (req.body['actionType'] === 'delete') {
        //読み込み処理

        // クエリ
        let query: string = '';
        query += 'DELETE FROM [dbo].[TrsTravelPlanSpot] ';
        query += `WHERE [PlanId] = ${req.body['PlanId']}`;


        const result = await queryWithRetry(query);

        res.status(200).json({ message: 'OK' });
    }



}
