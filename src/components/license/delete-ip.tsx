import React from 'react'
import { Button, message, Modal, Space } from 'antd'
import axios from "axios";

interface DeleteIpProps {
	ipId: string;
	bindIp: string;
	getAllAuths: () => void;
}

export const DeleteIp = ({ ipId, bindIp, getAllAuths }: DeleteIpProps) => {

	const handleDeleteIp = async () => {
		try {
			const res = await axios.delete(`/api/license/ip/${ipId}`);
			if (res?.data?.status === true) {
				getAllAuths()
				Modal.destroyAll()
				message.success(res?.data.message)
			} else {
				message.error(res?.data.message)
			}
		} catch (error) {
			message.error('失敗')
		}
	}

	return (
		<div>
			<Button
				type="link"
				danger
				onClick={() => {
					Modal.confirm({
						title: <div className="mt-2 mb-5">刪除綁定IP</div>,
						className: 'text-center',
						bodyStyle: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '155px',
						},
						width: 320,
						icon: null,
						content: (
							<div>
								<p>IP:{bindIp}</p>
								<p className="mb-5">您確定要刪除此IP綁定嗎?</p>
							</div>
						),
						footer: (_, { OkBtn, CancelBtn }) => (
							<>
								<CancelBtn />
								<Button type="primary" onClick={handleDeleteIp}>
									確定
								</Button>
							</>
						),
					})
				}}
			>
				刪除IP綁定
			</Button>
		</div>
	)
}
