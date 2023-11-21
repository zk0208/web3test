import { useRouter } from "next/router"
import useSWR, { Fetcher } from "swr";
import Image from "next/image";
import {
  Colors,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import Link from "next/link";
import * as Highchartsl from 'highcharts';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

export const config = {
  ssr: false,
};

ChartJS.register(
  Colors,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales
);

const fetcher: Fetcher<any, any> = (
  input: RequestInfo | URL,
  init?: RequestInit
) => globalThis.fetch(input, init).then((res) => res.json());

interface ResponseData<T> {
  type: "sql_endpoint";
  data: {
    columns: { col: string; data_type: string; nullable: false }[];
    rows: T[];
    result: { code: number };
  };
}

type HotRankingByBaseVolume = ResponseData<{ instid: string; hot_score: string }>;
// prettier-ignore
type CandleSticksByTime = ResponseData<{ time: string; open_price: string; high_price: string; 
  low_price: string; close_price: string; time_interval: string; }>;
// prettier-ignore
type PriceChangeByexchange = ResponseData<{ curr_price: string; update_time: string}>;
// prettier-ignore
type PriceByTime = ResponseData<{ curr_price: string; base_volume: string; update_time: string}>;

type ExchangeByInstID = ResponseData<{ exchange: string }>;

function Home1() {
  const router = useRouter();
  const {name} : any = router.query

  const [instid, setInstId] = useState(name || "BTC/USDT");

  const { data: hotRankingByBaseVolume } = useSWR(
    `/api/gateway/get_hot_ranking`,
    fetcher as Fetcher<HotRankingByBaseVolume, string>
  );
  const { data: exchangeByInstID } = useSWR(
    `/api/gateway/get_exchange_by_instid?instid=${instid}`,
    fetcher as Fetcher<ExchangeByInstID, string>
  );
  const ex :any = exchangeByInstID?exchangeByInstID.data.rows[0] : "okx";
  const [exchange, setExchange] = useState(ex?ex:'okx');
  
  const [startTime, setStartTime] = useState("2023-09-01 00:00:00");
  const [endTime, setEndTime] = useState("2023-09-03 00:00:00");
//   const { data: candleSticksByTime} = useSWR(
//     `/api/gateway/get_index_candlesticks?exchange=${exchange}&instid=${instid}&min_time=${startTime}&max_time=${endTime}`,
//     fetcher as Fetcher<CandleSticksByTime, string>
//   );
  const { data: priceByTime } = useSWR(
    `/api/gateway/get_trading_data_by_crypto?instid=${instid}&start_time=${startTime}&end_time=${endTime}`,
    fetcher as Fetcher<PriceByTime, string>
  );

  // const LabelB = priceChangeByexchange?.data.rows.map((i) => i.update_time);
  const labels_instid = hotRankingByBaseVolume?.data.rows.map((i) => i.instid);
  const lables_exchange = exchangeByInstID?.data.rows.map((i) => i.exchange);
  const labels = priceByTime?.data.rows.map((i) => i.update_time);

  const datasets = [
    {
      data: priceByTime?.data.rows.map((i) => Number(i.curr_price)),
      label: "Number of Crypto Price",
      yAxisID : "A",
      fill : true,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      data: priceByTime?.data.rows.map((i) => Number(i.base_volume)
      ),
      label: "Number of Crypto volume",
      yAxisID : "B",
      fill : true,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ];
//   const optionB = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top" as const,
//       },
//       title: {
//         display: true,
//         text: "Crypto price",
//       },
//     },
//   };
//   const LabelB = candleSticksByTime?.data.rows.slice(0,400).map((i) => i.time);
//   const dataB = [
//     {
//       data: candleSticksByTime?.data.rows.slice(200,-1).map((i) => Number(i.close_price)),
//       label: "Number of Crypto Price",
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     }];

  if (typeof Highcharts === 'object') {
    HighchartsMore(Highcharts)
  }
  if(typeof Highchartsl === 'object') {
    HighchartsMore(Highchartsl)
  }
  // const tmp = Highcharts.chart('container',optionINdex)

function Chartk(optionk:Highcharts.Options) {
    // if(typeof Highcharts == 'object') {
    //   HighchartsMore(Highcharts)
    // }
    const ex_name = lables_exchange?lables_exchange[0] : "okx";
    let ex = ex_name;
    const [exchange, setExchange] = useState(ex? ex:'okx');
    const { data: candleSticksByTime} = useSWR(
        `/api/gateway/get_index_candlesticks?exchange=${exchange}&instid=${instid}&min_time=${startTime}&max_time=${endTime}`,
        fetcher as Fetcher<CandleSticksByTime, string>
    );
    const dataIndex = candleSticksByTime?.data.rows.slice(0,400).map((i) => [i.time, Number(i.open_price), Number(i.high_price), Number(i.low_price), Number(i.close_price)]);
  
    const optionINdex:Highcharts.Options ={
        title : {
        text : 'IndexCandleSticks'
        },
        xAxis:{
        categories : candleSticksByTime?.data.rows.slice(0,400).map((i) => i.time),
        },
        rangeSelector : {
        buttons :[{
            type :'hour',
            count : 1,
            text : '1h'
        },{
            type :'day',
            count : 1,
            text : '1D'
        },{
            type :'all',
            count : 1,
            text : 'all'
        }],
        selected : 1,
        inputEnabled : true
        },
        tooltip: {
            split: false,
            // shared: true,
        },
        yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: '股价'
                },
                height: '90%',
                resize: {
                    enabled: true
                },
                lineWidth: 2
            }],
        plotOptions:{
        candlestick : {
            tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
            '开盘: {point.open}<br/>' +
            '最高: {point.high}<br/>' +
            '最低: {point.low}<br/>' +
            '收盘: {point.close}<br/>'
            }
        }
        },
        series : [{
        type : 'candlestick',
        name : 'candles',
        data : dataIndex,
        color: 'green',
        lineColor: 'green',
        upColor: 'red',
        upLineColor: 'red',
        tooltip: {
            valueDecimals : 3
                },
                id: 'sz'
        },]
    }
return (
    <>
        <div>
            <header className="flex justify-between font-bold">
                <div className="text-xl text-blue-400">
                    <Link rel="stylesheet" href="/">go back</Link>
                </div>
                
                <div className="text-xs flex items-center">
                    <span className="font-bold mr-1">Instid:</span>
                    <select value={instid} onChange={(e) => setInstId(e.target.value)}>
                    {labels_instid?.map((i) => (
                        <option key={i} value={i}>
                        {i}
                        </option>
                    ))}
                    </select>
                </div>
            </header>
            <header className="flex justify-end font-bold">
                <div className="text-xs flex items-center">
                <span className="font-bold mr-1">Exchange:</span>
                <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
                    {lables_exchange?.map((i) => (
                    <option key={i} value={i}>
                        {i}
                    </option>
                    ))}
                </select>
                </div>
            </header>
            <HighchartsReact
                highcharts = {Highcharts}
                options = {optionINdex}>
            </HighchartsReact>
        </div>      
        
    </>
      );
  }

function Pricek(){
    // if(typeof Highchartsl == 'object') {
    //     HighchartsMore(Highchartsl)
    // }
    const ex_name = lables_exchange?lables_exchange[0] : "okx";
    let ex = ex_name;
    const [exchange, setExchange] = useState(ex? ex:'okx');
    const { data: candleSticksByTime} = useSWR(
        `/api/gateway/get_index_candlesticks?exchange=${exchange}&instid=${instid}&min_time=${startTime}&max_time=${endTime}`,
        fetcher as Fetcher<CandleSticksByTime, string>
    );
    const LabelB = candleSticksByTime?.data.rows.slice(0,400).map((i) => i.time);
    const optionPrice:Highchartsl.Options ={
        chart:{
            zooming : {
                'type':'xy',
            },
        },
        title:{
            text:'Crypto price',
        },
        xAxis:{
            categories:LabelB,
        },
        yAxis: {
            title: {
                text: 'price'
            }
        },
        legend: {
            enabled: true,
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        // [0, Highcharts.getOptions().colors[0]],
                        // [1, new Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'price',
            data: candleSticksByTime?.data.rows.slice(0,400).map((i) => Number(i.close_price)),
        }]
      }
    return (
        <>  
        <div>
            <header className="flex justify-end">
                <div className="text-xs flex items-center">
                <span className="font-bold mr-1">Exchange:</span>
                <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
                    {lables_exchange?.map((i) => (
                    <option key={i} value={i}>
                        {i}
                    </option>
                    ))}
                </select>
                </div>
            </header>
                {/* <Pricek></Pricek> */}
            
            <HighchartsReact
            highcharts = {Highchartsl}
            options = {optionPrice}>
            </HighchartsReact>
        </div>
        </>
        );
  }

function PriceCmpLists(){
    var dataranksets = [];
    const len : any = lables_exchange?lables_exchange.length : 1;
    var LabelB :any;
    for (var i = 0; i < len; i++) {
      const ex_name = lables_exchange?lables_exchange[i] : "okx";
      let ex = ex_name;
      const { data: candleSticksByTime} = useSWR(
        `/api/gateway/get_index_candlesticks?exchange=${ex}&instid=${instid}&min_time=${startTime}&max_time=${endTime}`,
        fetcher as Fetcher<CandleSticksByTime, string>
      );
    LabelB = candleSticksByTime?.data.rows.slice(0,400).map((i) => i.time);
      

    //   let rank = candleSticksByTime;
    //   labeltime.push(moment(startT).add(i,'days').format("YYYY-MM-DD hh:mm:ss"));
      
      dataranksets.push({
        data : candleSticksByTime?.data.rows.slice(0,400).map((i) => Number(i.close_price)),
        name : ex,
        type: 'area',
      })

    }
    
    const optionP = {
        chart:{
            zooming : {
                'type':'xy',
            },
        },
        title:{
            text:'Crypto price',
        },
        xAxis:{
            categories: LabelB,
        },
        yAxis: {
            title: {
                text: 'price'
            }
        },
        legend: {
            enabled: true,
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        // [0, Highcharts.getOptions().colors[0]],
                        // [1, new Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: dataranksets,
    }

    return (
    <>
       <HighchartsReact
            highcharts = {Highchartsl}
            options = {optionP}>
        </HighchartsReact> 
    </>
    )
  }
  return (
    <div className="flex flex-col max-w-[880px] min-h-screen mx-auto gap-4 pt-8">
        {/* <div className="shadow-xl bg-white rounded p-4 w-full ">
            <header className="flex justify-between font-bold">
                <div className="text-xl text-blue-400">
                    <Link rel="stylesheet" href="/">go back</Link>
                </div>
                
                <div className="text-xs flex items-center">
                    <span className="font-bold mr-1">instid:</span>
                    <select value={instid} onChange={(e) => setInstId(e.target.value)}>
                    {labels_instid?.map((i) => (
                        <option key={i} value={i}>
                        {i}
                        </option>
                    ))}
                    </select>
                </div>
            </header>
            <Line options={{
                        responsive: true,
                        plugins: {
                        legend: {
                            position: "top" as const,
                        },
                        title: {
                            display: true,
                            text: "Crypto price & volume",
                        },
                        },
                        scales: {
                        A: {
                            type: 'linear',
                            position: 'left',
                            ticks :{
                            color : 'rgb(53, 162, 235)',
                            }
                        },
                        B: {
                            type: 'linear',
                            position: 'right',
                            ticks : {
                            color : 'rgb(255, 99, 132)',
                            }
                        }
                    }
                }} data={ { labels, datasets }} />
        </div> */}
        <div className="shadow-xl bg-white rounded p-4 md:flex-row md:min-h-[500px]">
            {/* <header className="flex justify-between font-bold">
                <div className="text-xl text-blue-400">
                    <Link rel="stylesheet" href="/">go back</Link>
                </div>
                
                <div className="text-xs flex items-center">
                    <span className="font-bold mr-1">Instid:</span>
                    <select value={instid} onChange={(e) => setInstId(e.target.value)}>
                    {labels_instid?.map((i) => (
                        <option key={i} value={i}>
                        {i}
                        </option>
                    ))}
                    </select>
                </div>
            </header> */}
            <Chartk></Chartk>
        </div>
        
        {/* <div className="flex gap-4 flex-col md:flex-row md:min-h-[500px]">
            <div className="shadow-xl bg-white rounded p-4 flex-1 flex-shrink-0 md:w-[49%]">
                <Pricek></Pricek>
            </div>
        </div> */}
        <div className="flex gap-4 flex-col md:flex-row md:min-h-[500px]">
            <div className="shadow-xl bg-white rounded p-4 flex-1 flex-shrink-0 md:w-[49%]">
                {/* <Line options={optionB} data={{labels: LabelB, datasets: dataB}} /> */}
                <PriceCmpLists></PriceCmpLists>
            </div>
        </div>

      <footer className="flex items-center justify-center mt-4">
        <a
          className="flex gap-2"
          href="https://tidbcloud.com/?utm_source=dataservicedemo&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          data-mp-event="Click TiDB Cloud Site Link"
        >
          Powered by{" "}
          <Image
            src="/tidb.svg"
            alt="TiDB Cloud Logo"
            width={138}
            height={24}
            priority
          />
        </a>
      </footer>
    </div>
  );
}


const price = () =>{
return(
    <>
        <div>
            <header className="flex justify-center">
            </header>
            <Home1></Home1>
        </div>
    </>
)
}

export default price