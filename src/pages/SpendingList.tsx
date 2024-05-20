import React from 'react';
import StickyHeadTable from '../components/StickyHeadTable'
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

class SpendingList extends React.Component {

    render() {
        const headers = [
            {
                name: "フォーム名"
            },
            {
                name: "備考"
            },
            {
                name: "作成日"
            },
            {
                name: "更新日"
            }
        ];
        const posts = [
            {
                "id": 1,
                "formName": "支出フォーム",
                "note": "支出のデータを入力するフォームです。",
                "createDate": "2024/05/10",
                "updateDate": "2024/06/01"
            }
        ];

        return (
            <div>
                <p>支出一覧</p>
                <Button variant="contained" color="primary" >
                    支出情報追加
                </Button>
                <StickyHeadTable headers={headers} rows={posts} />
            </div>
        )
    }
}

export default SpendingList;