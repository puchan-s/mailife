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
		const userTableId:string = req.body['userId'];
		const payDataType:string = req.body['payDataType'];
		const selectedDate:string = req.body['selectedDate'];
		
		// テスト用のクエリ
		let query: string = '';
		query += 'INSERT INTO [dbo].[TrsSpendingData] ';
		query += '( '
		query += '[userTableId] ';
		query += ',[payDataType] ';
		query += ',[name] ';
		query += ',[money] ';
		query += ',[payTiming] ';
		query += ',[payType] ';
		query += ',[payDate] ';
		query += ',[parentId] ';
		query += ') ';
		query += 'VALUES ';
		query += '( ';
		query += ` '${userTableId}'`;
		query += `, '${payDataType}'`;
		query += `, '${name}'`;
		query += `, '${money}'`;
		query += `, '${payTiming}'`;
		query += `, '${payType}'`;
		query += `, '${selectedDate}'`;
		query += `, '${parentId}'`;
		query += ') ';


		const result = await queryWithRetry(query);


		res.status(200).json({ message: 'OK' });
	}else if( req.body['actionType'] === 'Read'){
		//読み込み処理
		
		const userId:string = req.body['userId'];
		
		// テスト用のクエリ
		let query: string = '';
		query +=' SELECT';
		query +=' name,';
		query +=' money,';
		query +=' FORMAT(payDate,\'yyyy/MM/dd\') AS payDate,';
		query +=' mptiming.payTimingName,';
		query +=' mptype.payTypeName,';
		query +=' mpdType.payDateTypeName';
		query +=' FROM';
		query +=' TrsSpendingData As tsd';
		query +=' LEFT JOIN MstPayTiming AS mptiming ON tsd.payTIming = mptiming.payTimingID';
		query +=' LEFT JOIN MstPayType As mptype ON tsd.payType = mptype.payTypeID';
		query +=' LEFT JOIN MstPayDataType As mpdType ON tsd.payType = mpdType.payDataTypeId';
		query +=' WHERE';
		query +=` userTableID = ${userId}`;

		const result = await queryWithRetry(query);
		res.status(200).json({ message: 'OK', result:result.recordset });	
	}

}
