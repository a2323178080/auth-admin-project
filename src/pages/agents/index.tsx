import { useEffect, useState } from 'react'
import { message } from 'antd'
import { AddAgent } from '@/components/agent/add-agent'
import { AgentTable } from '@/components/agent/agent-table'
import {Toolbar} from '@/components/toolbar'
import {LinkBreadcrumb} from '@/components/link-breadcrumb'
import axios from "axios";

interface Agent {
    id: string
    key: string
    name: string
    licenseCount: number
    licenseIpCount: number
    createTime: string
}

export default function Agents() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [open, setOpen] = useState<boolean>(false)
    useEffect(() => {
        onGetAgentsData()
    }, [])
    const onGetAgentsData = async () => {
        try {
            const res = await axios.get('/api/agents')
            if (res.data.status === true) {
                setAgents(
                    res.data.data.map(item => {
                        return { ...item, key: item.id }
                    }),
                )
            }
        } catch (error) {
            message.error('取得代理商列表失敗')
        }
    }

    return (
        <div>
            <LinkBreadcrumb home />
            <Toolbar addButton title="新增代理商" onClick={() => setOpen(true)} />
            <AddAgent
                open={open}
                onCancel={() => setOpen(false)}
                callBack={onGetAgentsData}
            />
            <AgentTable agents={agents} onGetAgentsData={onGetAgentsData} />
        </div>
    )
}
