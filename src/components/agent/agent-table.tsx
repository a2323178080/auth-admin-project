import { Space, Table } from 'antd'
import Link from 'next/link'
import { EditAgent } from './edit-agent'
import { DeleteAgent } from './delete-agent'

interface Agent {
	id: string
	key: string
	name: string
	licenseCount: number
	licenseIpCount: number
	createTime: string
}

interface AgentsTableProps {
	agents: Agent[]
	onGetAgentsData: () => void
}


export const AgentTable = ({ agents, onGetAgentsData }: AgentsTableProps) => {

	const { Column } = Table

	const columns: any = [
		{
			title: '代理商名稱',
			dataIndex: 'name',
			key: 'agents',
			width: 200
		},
		{
			title: '機房授權數量',
			dataIndex: 'licenseCount',
			key: 'licenseCount',
			width: 200
		},
		{
			title: 'IP綁定總數',
			dataIndex: 'licenseIpCount',
			key: 'licenseIpCount',
			width: 200
		},
		{
			title: '操作',
			dataIndex: 'id',
			key: 'id',
			width: 200,
			align: 'left',
			render: (text, record) => {
				return (
					<Space size="middle">
						<Link
							href={`/licenses/${record.id}`}
							className="text-blue-400"
						>
							機房授權列表
						</Link>

						<EditAgent
							onGetAgentsData={onGetAgentsData}
							agentId={record.id}
							agentName={record.name}
						/>
						<DeleteAgent
							onGetAgentsData={onGetAgentsData}
							agentId={record.id}
							agentName={record.name}
						/>
					</Space>
				)
			},
		},
	]

	return (
		<div>
			<Table
				dataSource={agents}
				columns={columns}
				pagination={false}
			></Table>
		</div>
	)
}
