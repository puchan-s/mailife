"use client";

import React from 'react';
import StickyHeadTable from '../components/StickyHeadTable'
import Button from '@mui/material/Button';

class SpendingList extends React.Component {

    // ページ遷移を行う関数
    navigateToURL() {
        window.location.href = 'https://mui.com/material-ui/material-icons/?query=More';
    }

    render() {
     
        const handleClick = () => {
            alert('Button clicked!');
            console.log('Button was clicked');
          };

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
                <Button variant="contained" color="primary" onClick={this.navigateToURL}>
                    支出情報追加
                </Button>



                <Button variant="contained" color="primary"  onClick={handleClick}>
                    Click Me
                </Button>
            </div>
        )
    }
}

export default SpendingList;