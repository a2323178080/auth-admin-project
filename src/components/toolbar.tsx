import { Button } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import {useRouter} from "next/router";

interface ToolbarProps {
	returnButton?: boolean
	title?: string
	addButton?: boolean
	onClick?: () => void
}

export const Toolbar= ({ returnButton, title, addButton, onClick }: ToolbarProps) =>{

	const router= useRouter()
	return (
		<div className="flex justify-between">
			{returnButton ? (
				<div>
					<Button onClick={() => router.back()} className="mb-5 ml-5">
						<RollbackOutlined />
						返回
					</Button>
				</div>
			) : (
				<div></div>
			)}
			{addButton ? (
				<div>
					<Button type="primary" onClick={onClick} className="mb-5 mr-5">
						{title}
					</Button>
				</div>
			) : (
				<div></div>
			)}
		</div>
	)
}
