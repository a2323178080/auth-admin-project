import { Space, Table, Button, message, Switch ,Divider} from 'antd'
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import Link from 'next/link'
import axios from "axios";

import { BindIp } from './bind-ip'
import { DeleteIp } from './delete-ip'
import { LicenseExtend } from './license-extend'
import { DeleteLicense } from './delete-license'

interface IP {
	id: string;
	ip: string;
	createTime: string;
}

interface Authorization {
	agentId: string;
	agentName: string;
	id: string;
	name: string;
	createTime: string;
	startDate: string;
	expiredDate: string;
	isEnable: boolean;
	companySum: number;
	brandSum: number;
	posSum: number;
	byodSum: number;
	byodTogoSum: number;
	reserveByodTogoSum: number;
	ipList?: IP[];
}

interface LicenseTableProps {
	auths: Authorization[];
	getAllAuths: () => void;
	showDeleteIpModal?: (ipId: string) => void;
}

export const LicenseTable = ({ auths, getAllAuths }: LicenseTableProps) => {
	const generateExpandedRowRender = expandedData => {
		const columns = [
			{
				title: '#',
				dataIndex: 'index',
				key: 'index',
				render: (text, record, index) => index + 1,
			},
			{
				title: 'IP',
				dataIndex: 'ip',
				key: 'ip',
			},
			{
				title: '綁訂日期',
				dataIndex: 'createTime',
				key: 'createTime',
			},
			{
				title: '操作',
				dataIndex: 'id',
				key: 'action',
				render: (text, record, index) => {
					return (
						<Space size="small" direction="vertical">
							<DeleteIp
								ipId={record?.id}
								bindIp={record.ip}
								getAllAuths={getAllAuths}
							/>
						</Space>
					)
				},
			},
		]

		return (
			<Table
				size="small"
				rowKey={record => {
					return record.id
				}}
				columns={columns}
				pagination={false}
				dataSource={expandedData.ipList}
			/>
		)
	}
	const licenseEnableSwitch = async value => {
		try {
			const res = await axios.put('/api/license/enableSwitch',value )
			if (res.data.status === true) {
				getAllAuths()
				message.success('修改成功')
			} else {
				message.error('修改失敗')
			}
		} catch (error) {
			message.error('修改失敗')
		}
	}

	const columns: any = [
		{
			title: '機房名稱',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: '起始日',
			dataIndex: 'startDate',
			key: 'startDate',
			align: 'center',
		},
		{
			title: '到期日',
			dataIndex: 'expiredDate',
			key: 'expiredDate',
			align: 'center',
		},
		{
			title: '集團數量',
			dataIndex: 'companySum',
			key: 'companySum',
			align: 'center',
		},
		{
			title: '品牌數量',
			dataIndex: 'brandSum',
			key: 'brandSum',
			align: 'center',
		},
		{
			title: 'POS授權數量',
			dataIndex: 'posSum',
			key: 'posSum',
			align: 'center',
		},
		{
			title: 'BYOD授權數量',
			dataIndex: 'byodSum',
			key: 'byodSum',
			align: 'center',
		},
		{
			title: 'BYOD外帶數量',
			dataIndex: 'byodTogoSum',
			key: 'byodTogoSum',
			align: 'center',
		},
		{
			title: 'BYOD 預約外帶數量',
			dataIndex: 'reserveByodTogoSum',
			key: 'reserveByodTogoSum',
			align: 'center',
		},

		{
			title: '啟用狀態',
			dataIndex: 'isEnable',
			key: 'status',
			align: 'center',
			render: (text, record, index) => {
				return record.isEnable ? (
					<Switch
						defaultChecked
						onClick={() =>
							licenseEnableSwitch({
								licenseId: record.id,
								isEnable: !record.isEnable,
							})
						}
					/>
				) : (
					<Switch
						onClick={() =>
							licenseEnableSwitch({
								licenseId: record.id,
								isEnable: !record.isEnable,
							})
						}
					/>
				)
			},
		},
		{
			title: '操作',
			dataIndex: 'id',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return (
					<Space size={0} direction="vertical" className="py-0">
						<BindIp
							getAllAuths={getAllAuths}
							licenseId={record?.id}
						/>
						<Divider className="my-1" />

						<LicenseExtend
							getAllAuths={getAllAuths}
							authExtendStartDate={record.startDate}
							authName={record.name}
							licenseId={record.id}
						/>
						<Divider className="my-1" />

						<Divider className="my-1" />

						<Link href={`/quantityInformation/${record.id}`}>
							<Button type="link">
								數量詳情
							</Button>
						</Link>
						<Divider className="my-1" />

						<DeleteLicense
							licenseId={record?.id}
							startDate={record.startDate}
							expiredDate={record.expiredDate}
							getAllAuths={getAllAuths}
						/>
					</Space>
				)
			},
		},
	]
	const columnWidth = `${100 / columns.length}%`
	columns.forEach(column => {
		column.width = columnWidth
	})

	return (
		<div className="authsTable">
			{auths&&<h1 className="mb-4 ml-5 text-xl font-bold">{[...new Set(auths.map(item => item.agentName))]}</h1>}
			<Table
				rowKey={record => {
					return record.id
				}}
				dataSource={auths}
				columns={columns}
				bordered
				expandable={{
					expandedRowRender: generateExpandedRowRender,
					defaultExpandedRowKeys: ['0'],
					expandIcon: ({ expanded, onExpand, record }) => (
						<a onClick={e => onExpand(record, e)}>
							{expanded ? <DownOutlined /> : <RightOutlined />}
						</a>
					),
				}}
				pagination={false}
			></Table>
		</div>
	)
}
