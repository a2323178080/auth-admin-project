import { Breadcrumb } from 'antd'
import Link from 'next/link'
import { HomeOutlined } from '@ant-design/icons'
import {useRouter} from "next/router";

interface BreadcrumbItem {
	path: string
	title: React.ReactNode
}

interface LinkBreadcrumbProps {
	items?: BreadcrumbItem[]
	home?: boolean
}

export const LinkBreadcrumb = ({ items = [], home }: LinkBreadcrumbProps) => {
	const router= useRouter()

	const goback = () => {
		router.back()
	}

	const gotoAgents = () => {
		router.push('/agents')
	}

	const initialItems: BreadcrumbItem[] = [
		{
			path: '/agents',
			title: (
				<>
					<span>
						{home && <HomeOutlined style={{ fontSize: '20px',marginRight:'8px' }} />}<span className="text-sm">總覽</span>
					</span>
				</>
			),
		},
		...items,
	]

	function itemRender(item: BreadcrumbItem, params: any, items: BreadcrumbItem[],) {
		const last = items.indexOf(item) === items.length - 1

		if (last) {
			return <span> {item.title}</span>
		} else if (item.path === '/agents') {
			return (
				<span onClick={gotoAgents} className="cursor-pointer">
					<HomeOutlined style={{ fontSize: '20px' ,marginRight:'8px'}} />
					<span>{item.title}</span>
				</span>
			)
		} else if (item.path === '/licenses') {
			return (
				<span onClick={goback} className="cursor-pointer">
					{item.title}
				</span>
			)
		}
		return <Link href={item.path}>{item.title}</Link>
	}

	return (
		<div>
			<Breadcrumb
				itemRender={itemRender}
				items={initialItems}
				className="text-lg mt-5 mb-5 ml-5"
			/>
		</div>
	)
}
