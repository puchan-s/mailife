// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { queryWithRetry } from '../../utils/queryWithRetry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	// テスト用のクエリ
	const query: string = `SELECT 'x' FROM trsUser WHERE userId ='${req.body['email']}' AND password='${req.body['password']}'`;
	const result = await queryWithRetry(query);

	if (  result.recordset.length !== 0 ) {
		res.status(200).json({ message: 'OK' });
	}else{
		res.status(200).json({ message: 'NG' });
	}
}

