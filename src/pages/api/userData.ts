// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { queryWithRetry } from '../../utils/queryWithRetry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	if( req.body['actionType'] === 'create'){
		//追加処理
		const name:string = req.body['name'];
		const money:number = req.body['money'];
		const payTiming:string = req.body['payTiming'];
		const payType:string = req.body['payType'];
		const parentId:string = '0';//req.body['parentId'];
		
		// テスト用のクエリ
		let query: string = '';
		query += 'INSERT INTO [dbo].[TrsSpendingData] ';
		query += '([name] ';
		query += ',[money] ';
		query += ',[payTiming] ';
		query += ',[payType] ';
		query += ',[parentId]) ';
		query += 'VALUES ';
		query += '( ';
		query += ` '${name}'`;
		query += `, '${money}'`;
		query += `, '${payTiming}'`;
		query += `, '${payType}'`;
		query += `, '${parentId}'`;
		query += ') ';


		const result = await queryWithRetry(query);


		res.status(200).json({ message: 'OK' });
	}else if( req.body['actionType'] === 'lead'){
		//読み込み処理
		
		const userId:string = req.body['userId'];
		
		// テスト用のクエリ
		let query: string = '';
		if( userId ){

		}else{
			query += 'SELECT * FROM trsUser';
		}


		const result = await queryWithRetry(query);
		res.status(200).json({ message: 'OK', result:result.recordset });	
	}

}
