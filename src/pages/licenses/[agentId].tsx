import { useEffect, useState } from 'react'
import axios from "axios";
import {Toolbar} from '@/components/toolbar'
import {LinkBreadcrumb} from '@/components/link-breadcrumb'
import {useRouter} from "next/router";

import { AddLicense } from '@/components/license/add-license'
import { LicenseTable } from '@/components/license/license-table'

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

interface Props {
    agentId: string;
}

//依代理商取得授權列表
export default ({ agentId }: Props) => {
    const router = useRouter()

    const [auths, setAuths] = useState<Authorization[]>([])
    useEffect(() => {
        getAllAuths()
    }, [agentId])
    const getAllAuths = async () => {
        const res = await axios.get('/api/licenses',{
            params: {
                agentId: agentId,
            },
        })
        setAuths(res?.data.data)
    }
    // 新增授權
    const [AddModalOpen, setAddModalOpen] = useState(false)
    const showAddModal = () => {
        setAddModalOpen(true)
    }
    const cancelAddModal = () => {
        setAddModalOpen(false)
    }

    const authroizationListPage = [
        {
            path: '/license',
            title: <span className="text-sm">機房授權列表</span>
        },
    ]

    return (
        <div>
            <LinkBreadcrumb items={authroizationListPage} />
            <Toolbar addButton returnButton title="新增授權" onClick={showAddModal} />
            <LicenseTable auths={auths} getAllAuths={getAllAuths} />
            <AddLicense
                AddModalOpen={AddModalOpen}
                cancelAddModal={cancelAddModal}
                getAllAuths={getAllAuths}
                id={router.query.agentId}
            />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { agentId } = context.params;
    return { props: { agentId } };
}
