// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { queryWithRetry } from '../../utils/queryWithRetry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const dataType:string = req.body['dataType'];
    const userId:string = req.body['userId'];

		//読み込み処理
		
		// テスト用のクエリ
		let query: string = '';
        if( userId === '' ){
            //ユーザ指定なし
            query += `SELECT[money], payDate , payTiming FROM [MAILIFEDB].[dbo].[TrsSpendingData] WHERE dataType = ${dataType} ORDER BY payDate`;
        }else{
            query += `SELECT[money], payDate , payTiming FROM [MAILIFEDB].[dbo].[TrsSpendingData] WHERE dataType = ${dataType} AND userTableID = ${userId} ORDER BY payDate`;
        }


		const result = await queryWithRetry(query);

        //各月の購入額
        const resData:number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

        result.recordset.map((value) =>{

            //月の添え字 0-11
            const nowMonth = new Date(value.payDate).getMonth() ;

            if( value.payTiming == 3 ){
                //毎月
                for(let i:number = nowMonth; i < 12;i++){
                    //今月から12月まで追加する
                    resData[i] += value.money;
                }
            }else if( value.payTiming == 1 ){
                //1回のみの購入
                resData[nowMonth] += value.money;
            }


        });

        resData[1] += resData[0];
        resData[2] += resData[1];
        resData[3] += resData[2];
        resData[4] += resData[3];
        resData[5] += resData[4];
        resData[6] += resData[5];
        resData[7] += resData[6];
        resData[8] += resData[7];
        resData[9] += resData[8];
        resData[10] += resData[9];
        resData[11] += resData[10];

		res.status(200).json({ message: 'OK', result:resData });	


}
