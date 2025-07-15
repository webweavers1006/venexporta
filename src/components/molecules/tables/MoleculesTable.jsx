import { Table } from 'antd';
const MoleculesTable = ({ config, pagination}) => {
    return (
        <div>
            <Table columns={config.columns(config.handleRegister)} dataSource={config.data} pagination={pagination} />
        </div>
    );
};

export default MoleculesTable;