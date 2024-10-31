import React from 'react'
import { Button, message, Modal, Space } from 'antd'
import axios from "axios";

interface DeleteAgentProps {
	agentId: string
	agentName: string
	onGetAgentsData: () => void
}

export const DeleteAgent = ({ agentId, agentName, onGetAgentsData }: DeleteAgentProps) => {
	const handleDeleteAgent = async () => {
		try {
			const res = await axios.delete(`/api/agent/${agentId}`);
			if (res?.data?.status === true) {
				onGetAgentsData()
				Modal.destroyAll()
				message.success(res?.data.message)
			} else {
				message.error(res?.data.message)
			}
		} catch (error) {
			message.error("失敗")
		}
	}

	return (
		<div>
			<Button
				type="link"
				danger
				onClick={() => {
					Modal.confirm({
						title: (
							<div className="mt-2 mb-5">
								刪除代理商
							</div>
						),
						className: 'text-center',
						bodyStyle: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '155px',
						},
						width: 320,
						icon:null,
						content: (
							<div>
								<p>代理商:{agentName}</p>
								<p className="mb-5">您確定要刪除此代理商嗎?</p>
							</div>
						),
						footer: (_, { OkBtn, CancelBtn }) => (
							<>
								<CancelBtn />
								<Button type="primary" onClick={handleDeleteAgent}>確定</Button>
							</>
						),
					})
				}}
			>
				刪除
			</Button>
		</div>
	)
}
