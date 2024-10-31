export const columns: any = [
	{
		title: '#',
		dataIndex: 'keyValue',
		onCell: (_, index) => {
			return { rowSpan: _.rowSpan ? _.rowSpan : 0 }
		},
		align:'center',
		width:70,
	},
	{
		title: '集團名稱',
		dataIndex: 'companyName',
		onCell: (_, index) => {
			return { rowSpan: _.rowSpan ? _.rowSpan : 0 }
		},
		//
		render: (text, record) => {
			return <div>{record.companySum || record.companyName}</div>
		},
		//
	},
	{
		title: '品牌名稱',
		dataIndex: 'brandName',
		onCell: (_, index) => {
			return { rowSpan: _.brandRowSpan ? _.brandRowSpan : 0 }
		},
		//
		render: (text, record) => {
			return <div>{record.brandSum || record.brandName || 0}</div>
		},
		//
	},
	{
		title: '分店名稱',
		dataIndex: 'shopName',
		render: (text, record) => {
			return (
				<div>
					{record.keyValue === '小計' || record.keyValue === '合計' ? (
						record.shopSum || record.shopName || 0
					) : (
						<div>{text}</div>
					)}
				</div>
			)
		},
	},
	{
		title: 'POS數量',
		dataIndex: 'posTotal',
		key: 'postTotal',
		children: [
			{
				title: '已啟用',
				dataIndex: 'posActive',
				key: 'posActive',
				render: (text, record) => {
					return (
						<div>
							{record.posTotalSum
								? `${record.posTotalSum}(${record.posActiveSum})`
								: record.posActive || 0}
						</div>
					)
				},
				width:100
			},
			{
				title: '未啟用',
				dataIndex: 'posReady',
				key: 'posReady',
				render: (text, record) => {
					return <div>{record.posReadySum || record.posReady || 0}</div>
				},
				width:100
			},
			{
				title: '已過期',
				dataIndex: 'posExpired',
				key: 'posExpired',
				render: (text, record) => {
					return <div>{record.posexpiredSum || record.posExpired || 0}</div>
				},
				width:100
			},
		],
	},
	{
		title: 'BYOD數量',
		dataIndex: 'byodTotal',
		children: [
			{
				title: '已啟用',
				dataIndex: 'byodActive',
				key: 'byodActive',
				render: (text, record) => {
					return <div>{record.byodActiveSum || record.byodActive || 0}</div>
				},
				width:100
			},
			{
				title: '未啟用',
				dataIndex: 'byodReady',
				key: 'byodReady',
				render: (text, record) => {
					return <div>{record.byodReadySum || record.byodReady || 0}</div>
				},
				width:100
			},
			{
				title: '已過期',
				dataIndex: 'byodExpired',
				key: 'byodExpired',
				render: (text, record) => {
					return <div>{record.byodExpiredSum || record.byodExpired || 0}</div>
				},
				width:100
			},
		],
	},
	{
		title: 'BYOD外帶/預約外帶數量',
		dataIndex: 'byodTogoTotal',
		children: [
			{
				title: '外帶',
				dataIndex: 'byodTogo',
				key: 'byodTogo',
				render: (text, record) => {
					return <div>{record.byodTogoSum || record.byodTogo || 0}</div>
				},
				width:100
			},
			{
				title: '預約外帶',
				dataIndex: 'reserveByodTogo',
				key: 'reserveByodTogo',
				render: (text, record) => {
					return <div>{record.reserveByodTogoSum || record.reserveByodTogo || 0}</div>
				},
				width:100
			},
		],
	},
]
