import { message, Table } from 'antd'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import axios from "axios";

interface Shop {
	key: string;
	shopId: string;
	shopName: string;
	posActive: string;
	posReady: string;
	posExpired: string;
	posTotal: string;
	byodActive: string;
	byodReady: string;
	byodExpired: string;
	byodTogo: string;
	reserveByodTogo: string;
}
interface Brand {
    key: string;
    brandName: string;
    shopList: Shop[];
}

//決定集團的rowSpan
const handleCompanyRowSpan = (brandListArray: Brand[]): number => {
	let number = 0
	brandListArray.forEach(item => {
		if (item.shopList.length === 0) number++
		else
			item.shopList.forEach(() => {
				number++
			})
	})
	return number
}

export default function QuantityTable({ licenseId }:{licenseId: string}) {
	const [initialObject, setInitialObject] = useState<any>({})
	const [initialArray, setInitialArray] = useState([])
	useEffect(() => {
		getQuantity()
	}, [])

	const getQuantity = async () => {
		try {

			const res = await axios.get(`/api/quantity/${licenseId}`)
			if (res?.data?.status === true) {
				setInitialObject(res?.data.data)
				setInitialArray(res?.data.data.companyList)
			}
		} catch (error) {
			message.error('失敗')
		}
	}

	const getNewArray = array => {
		const newArray: any = []
		array.forEach((item, index0) => {
			if (item.brandList.length === 0) {
				item.brandList.push({
					key: 'test',
					brandName: '-',
					shopList: [],
				})
			}
			item.brandList.forEach((brandObject, index) => {
				if (brandObject.shopList.length === 0) {
					brandObject.shopList.push({
						key: 'withoutShop',
						shopId: '',
						shopName: '-',
						posActive: '-',
						posReady: '-',
						posExpired: '-',
						posTotal: '-',
						byodActive: '-',
						byodReady: '-',
						byodExpired: '-',
						byodTogo: '-',
						reserveByodTogo: '-',
					})
				}

				brandObject.shopList.forEach((shopObject, shopObjectIndex) => {
					if (shopObjectIndex === 0) {
						shopObject = {
							...shopObject,
							brandRowSpan: brandObject.shopList.length,
						}
						if (index === 0)
							shopObject = {
								...shopObject,
								index: index,
								rowSpan: handleCompanyRowSpan(item.brandList),
							}
					}

					//產生新的陣列裡面包含brandRowSpan、rowSpan、companyName、brandName
					newArray.push({
						...shopObject,
						companyName: item.companyName,
						brandName: brandObject.brandName,
						keyValue: array.indexOf(item) + 1,
						posActive: `${shopObject.posTotal}(${shopObject.posActive})`,
					})
				})
			})
			newArray.push({ ...item, keyValue: '小計', rowSpan: 1, brandRowSpan: 1 })
		})

		newArray.push({
			keyValue: '合計',
			rowSpan: 1,
			brandRowSpan: 1,
			companyName: initialObject.companyAllSum,
			brandName: initialObject.brandAllSum,
			shopName: initialObject.shopAllSum,

			posActive: `${initialObject.posTotalAllSum}(${initialObject.posActiveAllSum})`,
			posReady: initialObject.posReadyAllSum,
			posExpired: initialObject.posExpiredAllSum,

			byodActive: initialObject.byodActiveAllSum,
			byodReady: initialObject.byodReadyAllSum,
			byodExpired: initialObject.byodExpiredAllSum,
			byodTogo: initialObject.byodTogoAllSum,
			reserveByodTogo: initialObject.reserveByodTogoAllSum,
		})

		return newArray
	}

	const getRowClassName = record => {
		if (record.keyValue === '小計') {
			return 'bg-custom-light-gray'
		} else if (record.keyValue === "合計") {
			return 'bg-slate-500 text-white'
		}
		return ''
	}
	return (
		<div className="quantity-table">
			{initialObject&&	<h1 className="mb-4 ml-5 text-xl font-bold">{initialObject.licenseName}</h1>}

			{initialObject && initialObject.companyAllSum ? (
				<Table
					columns={columns}
					dataSource={getNewArray(initialArray)}
					bordered
					pagination={false}
					rowClassName={getRowClassName}
					className="gray-header"
				/>
			) : (
				<Table />
			)}
		</div>
	)
}
