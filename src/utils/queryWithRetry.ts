import sql, { ConnectionPool } from 'mssql';

// データベース接続設定
const config: sql.config = {
    user: 'sa',
    password: 'sa',
    server: 'localhost', // インスタンス名は options.instanceName で指定
    database: 'MAILIFEDB', // 接続するデータベースの名前
    options: {
        instanceName: 'NODESERVER', // インスタンス名をここで指定
        encrypt: true,
        trustServerCertificate: true // 自己署名証明書を信頼する
    },
    port: 1433 // デフォルトのポート番号を指定
};

// クエリの実行とリトライを試行する関数
export const queryWithRetry = async (query: string, retryCount: number = 5): Promise<object> => {
    try {
        // データベースへの接続を確立
        const pool: ConnectionPool = await sql.connect(config);

        // クエリの実行
        const result = await pool.request().query(query);
        console.log(typeof result);
        console.log('Query result:', result);

        // データベース接続を閉じる
        await pool.close();

        return result;
    } catch (error) {
        // クエリ実行エラーの処理
        console.error('Query execution failed:', error);
        if (retryCount > 0) {
            console.log(`Retrying... (${retryCount} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒待機
            return queryWithRetry(query, retryCount - 1); // リトライ
        } else {
            console.error('Maximum retry attempts reached. Query failed.');
        }
        return {};
    }
};
