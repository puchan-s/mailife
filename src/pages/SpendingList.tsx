'use client'

import React from 'react';
import StickyHeadTable from '../components/StickyHeadTable'
import CustomButton from '../components/CustomButton'
import RetryableAxios from '@/utils/RetryableAxios';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';


import { useSearchParams, usePathname, useParams } from "next/navigation";

// Chart.jsに必要なコンポーネントを登録します
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  // グラフの設定
  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
};


interface State {
    listData:object[],
    totalMoneySpending:number[],
    totalMoneyIncome:number[],
    userId:string
  };

class SpendingList extends React.Component<{},State> {

    headers:{name:string}[] ;

    constructor(props: {}) {
        super(props);
        this.state = {
            listData:[],
            totalMoneySpending:[],
            totalMoneyIncome:[],
            userId:'3'
        };

        this.headers = [
            {
                name: "商品名"
            },
            {
                name: "金額"
            },
            {
                name: "購入日付"
            },
            {   
                name: "支払いタイミング"
            },
            {
                name: "支払い種類"
            }
        ];
                
    }

    async componentDidMount() {
        this.updateData();
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (prevState.userId !== this.state.userId) {
            this.updateData();
        }
      }

    updateData(){

        const retryableAxios = new RetryableAxios(3); // 最大3回リトライする
        retryableAxios.request({
          url: '/api/spendingData',
          method: 'POST',
          data:{
            'actionType':'lead',
            userId:this.state.userId
          }
        })
        .then(response => {
          console.log('Success:', response.data);
          if (response.data.message === "OK") {
            // select取得時の処理
            this.setState({ listData: response.data.result } as Pick<State, keyof State>);
          }
        })
        .catch(error => console.error('Error:', error));

        retryableAxios.request({
          url: '/api/totalMoney',
          method: 'POST',
          data:{
            dataType:'2',
            userId:this.state.userId
          }
        })
        .then(response => {
          console.log('Success:', response.data);
          if (response.data.message === "OK") {
            // select取得時の処理
            this.setState({ totalMoneyIncome : response.data.result } as Pick<State, keyof State>);
          }
        })
        .catch(error => console.error('Error:', error));
  
          retryableAxios.request({
            url: '/api/totalMoney',
            method: 'POST',
            data:{
              dataType:'1',
              userId:this.state.userId
            }
          })
          .then(response => {
            console.log('Success:', response.data);
            if (response.data.message === "OK") {
              // select取得時の処理
              this.setState({ totalMoneySpending : response.data.result } as Pick<State, keyof State>);
            }
          })
          .catch(error => console.error('Error:', error));

    }

    // ページ遷移を行う関数
    navigateToURL() {
        window.location.href = 'https://mui.com/material-ui/material-icons/?query=More';
    }

    render() {
        const { listData,totalMoneySpending,totalMoneyIncome, userId } = this.state;
    
        const diffData = [];
        for(var i:number = 0; i < 12 ; i++){
            diffData.push(totalMoneyIncome[i] - totalMoneySpending[i]);
        }

        const data: ChartData<'bar'> = {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月','7月','8月','9月','10月','11月','12月'],
            datasets: [
              {
                label: '支出',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(192,75,192,0.4)',
                borderColor: 'rgba(192,75,192,1)',
                borderWidth: 2,
                data: totalMoneySpending
              },
              {
                label: '収入',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                data: totalMoneyIncome
              },
              {
                label: '実差額',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(192,192,75,0.4)',
                borderColor: 'rgba(192,192,75,1)',
                borderWidth: 2,
                data: diffData
              }
            ],
          };

        return (
            <div>
                <Box sx={{ width: 1800, height: 800, backgroundColor: 'lightblue' }}>
                    <p>支出一覧</p>
                    <Bar data={data} options={options} />

                    <Select
                        id="payType"
                        label="種別"
                        value={userId}
                        onChange={(e) => this.setState({ userId : e.target.value } as Pick<State, keyof State>)}
                    >
                        <MenuItem value={'1'}>村上聖矢</MenuItem>
                        <MenuItem value={'3'}>家族</MenuItem>
                    </Select>

                    <CustomButton routePath='SpendingDetails' context='支出追加' />

                    <StickyHeadTable headers={this.headers} rows={listData} />
                </Box>
            </div>
        )
    }
}

export default SpendingList;