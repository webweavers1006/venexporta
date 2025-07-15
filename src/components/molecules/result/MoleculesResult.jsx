import { Result } from 'antd';

const ResultComponent = ({ config }) => {
  return (
    <div className="box z-10">
      <Result
        status={config.status}
        title={config.title}
        subTitle={config.subTitle}
        extra={config.links}
      >
        {config.messages.length>0?config.messages.map((message, index) => (
          <p key={index}>{message}</p>
        )):null}
      </Result>
    </div>
  );
};

export default ResultComponent;