const agents = [
    {
        id: "3bdc9da1-c2c0-4a86-a1d0-b86e7e675813",
        name: "點溡",
        createTime: "2023-10-02 13:17:09",
        licenseCount: 0,
        licenseIpCount: 0
    },
    {
        id: "0b0e1db8-4309-450e-b04f-91b234442537",
        name: "EX咖哩棒",
        createTime: "2023-07-22 22:42:32",
        licenseCount: 9,
        licenseIpCount: 1
    },
    {
        id: "aec3dea9-6e42-4e92-8d3e-7647d8f7e1c4",
        name: "EX咖哩棒",
        createTime: "2023-07-22 22:39:40",
        licenseCount: 0,
        licenseIpCount: 0
    }
];

export default agents;

export function addAgent(newAgent) {
    agents.push(newAgent);
}
